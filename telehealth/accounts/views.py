from os import stat
from django.http import response
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserSerializer
from rest_framework.exceptions import AuthenticationFailed
from .models import User
import jwt, datetime
from django.http.response import HttpResponse
from django.shortcuts import redirect
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers, status,generics
from .utils import Util
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings
from .serializers import RequestPasswordResetEmailSerializer,SetNewPasswordSerializer
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str,force_str,smart_bytes,DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import Util

# from .serializers import ChangePasswordSerializer
# from rest_framework.permissions import IsAuthenticated
# Create your views here.

class RegisterView(APIView):
    """View to register user and store user details in the database"""
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_verified=False
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        user_data = serializer.data
        user=User.objects.get(email=user_data['email'])

        token = RefreshToken.for_user(user).access_token
        # print("token1:",token)

        current_site = get_current_site(request).domain
        relativeLink=reverse('email-verify')

        absurl = 'http://'+current_site+relativeLink+"?token="+str(token)
        email_body = 'Hi '+user.first_name+'Use the below link to verify your email\n'+absurl
        data = {'email_body':email_body,'to_email':user.email,'email_subject':'verify your email.'}
        Util.send_email(data)

        return Response(user_data,status=status.HTTP_201_CREATED)

class VerifyEmail(generics.GenericAPIView):
    def get(self,request):
        pass
        token=request.GET.get('token')
        print(token)
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
            user = User.objects.get(id=payload['user_id'])
            
            if not user.is_verified:
                user.is_verified = True
                user.save()
                return Response({'email':'Succesfully activated'},status=status.HTTP_200_OK)

            
        except jwt.ExpiredSignatureError as identifier:
            return Response({'error':'Activation Expired'},status=status.HTTP_400_BAD_REQUEST)

        except jwt.exceptions.DecodeError as identifier:
            return Response({'error':'Invalid Token'},status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """Let user login and sends out a jwt token and stores in cookies"""
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found!')

        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')

        payload = {
                'id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }
        
        token = jwt.encode(payload, 'secret', algorithm='HS256').decode('utf-8')

        response = Response()
        response.set_cookie(key='jwt',value=token,httponly=True)
        serializer = UserSerializer(user)
        response.data = serializer.data

        return response

class UserView(APIView):
    """Get user details using jwt token"""
    def get(self, request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        return Response(serializer.data)

class LogoutView(APIView):
    """Let users logout"""
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response

class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = RequestPasswordResetEmailSerializer

    def post(self,request):

        serializer = self.serializer_class(data=request.data)
        email = request.data['email']

        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email) #creating user
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id)) #Encoding the userid

            token = PasswordResetTokenGenerator().make_token(user) 
            #Genrating token to reset password, validating token so that another user don't use the same token again

            current_site = get_current_site(request = request).domain

            relativeLink = reverse(
                'password-reset-confirm',kwargs={'uidb64':uidb64,'token':token})

            absurl = 'http://'+current_site+ relativeLink
            email_body = 'Hi '+user.first_name+'\nUse the below link to reset your password. \n'+absurl
            data = {'email_body':email_body,'to_email':user.email,'email_subject':'Reset your Password.'}
            Util.send_email(data)

        #Sending response if successfully sent the link with status code.
        return Response( {'Success':'We have sent you a link to reset your password.'}, status=status.HTTP_200_OK)


class PasswordTokenCheckAPI(generics.GenericAPIView):

    # handelling GET request
    def get(self,request,uidb64,token):
        try:
            id=smart_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user,token):
                return Response( {'error':'Token is not valid, please request a new one.'},status=status.HTTP_401_UNAUTHORIZED)

            return Response({'success':True,'message':'Credentials valid.','uidb64':uidb64,'token':token},status=status.HTTP_200_OK)

        except DjangoUnicodeDecodeError as identifier:
            return Response({'error':'Decode error'},status=status.HTTP_401_UNAUTHORIZED)

#To manage and picking a new password
class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    #Chnaging the password
    def patch(self,request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({'success':True,'message':'password reset successfully'},status=status.HTTP_200_OK)













