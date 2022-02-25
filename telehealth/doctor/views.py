from django.core import paginator
from django.http import response
from django.shortcuts import render
from django.core.paginator import Paginator
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Licence ,Feedback, Profile, Specialization
from .serializers import DoctorLicenceSerializer, FeedbackResponseSerializer, FeedbackSerializer, ProfileSerializer, SpecializationSerializer, DoctorSerializer
from rest_framework import status, serializers
from rest_framework.exceptions import AuthenticationFailed, NotFound, APIException
import jwt
from accounts.models import User
from accounts.serializers import UserSerializer
from django.db.models import Sum
from .serializers import RatingSerializer
from .models import Ratings
from Patient.models import PatientProfile
from django.core.files.storage import default_storage
import datetime


# Create your views here.

class EditProfileOnRegistrationView(APIView):
    """View to edit doctor profile details"""
    def post(self, request):
        token = request.COOKIES.get('jwt')
        
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        requestData = request.data.copy()
        imageName = str(requestData['image'])
        
        user = User.objects.filter(id=payload['id']).first()
        try:
            user.phone_number = requestData['phone_number']
            user.full_clean()
            user.save()
        except Exception as e:
            exception = APIException("Phone number must be entered in the format: '+9999999999'. Only 10 digits allowed.")
            exception.status_code = 400
            raise exception
        requestData.pop('phone_number')

        if imageName:
            fileExt = imageName.split(".")[1]
            fileName = f'{str(user.id)}_image.{fileExt}'
            requestData['image'].name = fileName

        specialization = Specialization.objects.filter(user=user).first()
        
        if not specialization:
            specialization = Specialization(user=user)

        specialization.name = requestData['specialization']
        specialization.save()

        license_number = requestData['licence_number']
        requestData.pop('specialization')
        requestData.pop('licence_number')

        profile = Profile.objects.filter(user=user).first()
    
        serializerProfile = ProfileSerializer(data=requestData)
        serializerProfile.is_valid(raise_exception=True)

        if not profile:
            serializerProfile.save()
            profile_data = serializerProfile.data
            profile=Profile.objects.get(id=profile_data['id'])
            profile.user = user

        else:
            profile_data = serializerProfile.data
            if imageName:
                if default_storage.exists(profile.image.name):
                    profile.image.delete()
                profile_data['image'] = requestData['image']
            else:
                profile_data.pop('image')

            for (key,value) in profile_data.items():
                setattr(profile,key,value)

        profile.save()

        license = Licence.objects.filter(doctor=profile)

        if not license:
            license = Licence()
            license.number = license_number
            license.is_verified = False
            license.doctor = profile
            license.save()

        return Response({'success':True,'message':'profile updated successfully'},status=status.HTTP_200_OK)
class EditProfileView(APIView):
    """View to edit doctor profile details"""
    def post(self, request):
        token = request.COOKIES.get('jwt')
        
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        requestData = request.data.copy()
        imageName = str(requestData['image'])
        
        user = User.objects.filter(id=payload['id']).first()
        try:
            user.phone_number = requestData['phone_number']
            user.full_clean()
            user.save()
        except Exception as e:
            exception = APIException("Phone number must be entered in the format: '+9999999999'. Only 10 digits allowed.")
            exception.status_code = 400
            raise exception
        requestData.pop('phone_number')

        if imageName:
            fileExt = imageName.split(".")[1]
            fileName = f'{str(user.id)}_image.{fileExt}'
            requestData['image'].name = fileName

        specialization = Specialization.objects.filter(user=user).first()
        
        if not specialization:
            specialization = Specialization(user=user)

        specialization.name = requestData['specialization']
        specialization.save()

        # license_number = requestData['licence_number']
        requestData.pop('specialization')
        # requestData.pop('licence_number')

        profile = Profile.objects.filter(user=user).first()
    
        serializerProfile = ProfileSerializer(data=requestData)
        serializerProfile.is_valid(raise_exception=True)

        if not profile:
            serializerProfile.save()
            profile_data = serializerProfile.data
            profile=Profile.objects.get(id=profile_data['id'])
            profile.user = user

        else:
            profile_data = serializerProfile.data
            if imageName:
                if default_storage.exists(profile.image.name):
                    profile.image.delete()
                profile_data['image'] = requestData['image']
            else:
                profile_data.pop('image')

            for (key,value) in profile_data.items():
                setattr(profile,key,value)

        profile.save()

        # license = Licence.objects.filter(doctor=profile)

        # if not license:
        #     license = Licence()
        #     license.number = license_number
        #     license.is_verified = False
        #     license.doctor = profile
        #     license.save()

        return Response({'success':True,'message':'profile updated successfully'},status=status.HTTP_200_OK)

class ProfileView(APIView):
    """View to view doctor profile"""
    def get(self, request):
        token = request.COOKIES.get('jwt')
        
        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated!')

        user = User.objects.filter(id=payload['id']).first()
        specialization = Specialization.objects.filter(user=user).first()
        profile = Profile.objects.filter(user=user).first()

        response = Response()
        response.data = {
            'user': UserSerializer(user).data,
            'profile': ProfileSerializer(profile).data,
            'specialization' : SpecializationSerializer(specialization).data
        }
        return response

class DoctorsListView(APIView):
    """View see list of doctors"""
    def get(self, request):
        # token = request.COOKIES.get('jwt')
        # if not token:
        #     raise AuthenticationFailed('Unauthenticated!')

        # try:
        #     payload = jwt.decode(token, 'secret', algorithms='HS256')
        # except jwt.ExpiredSignatureError:
        #     raise AuthenticationFailed('Unauthenticated!')
        page_num = request.GET.get('page')
        specialization = request.GET.get('specialization')
        profile = Profile.objects.filter(licence__is_verified=True).all()
        if specialization:
            # print("inside if")
            user = User.objects.filter(profile__in=profile,specialization_name__name=specialization).all()
        else:
            user = User.objects.filter(profile__in=profile).all()
            # print("inside else")
            # print(user)
        paginator = Paginator(user,6)
        page = paginator.page(page_num)
        # print(page)
        serializer = DoctorSerializer(page,many=True)
        response = {'results':serializer.data,
        'num_pages':paginator.num_pages,
        'has_previous':page.has_previous(),
        'has_next': page.has_next()
        }
        return Response(response,status=status.HTTP_200_OK)

class GetDoctorView(APIView):
    """View to get doctor by id"""
    def get(self, request):
        
        doctorId = request.GET.get('doctor_id')

        user = User.objects.filter(id=doctorId,is_doctor=True).first()

        if not user:
            raise NotFound("Doctor doesn't exists")

        serializer = DoctorSerializer(user)

        response = {'result':serializer.data}

        return Response(response,status=status.HTTP_200_OK)

#View to give the ratings to any doctor using her/his doctor_id
class RatingsView(APIView):
    def post(self,request,doctor_id):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('User Unauthenticated')
        try:
            payload = jwt.decode(token,'secret',algorithms='HS256')
            print('payload:',payload)
            print('doctor id:',doctor_id)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired')
        
        patient = PatientProfile.objects.filter(user_id=payload['id']).first()
        doctor = Profile.objects.filter(id=doctor_id).first()
        
        if not patient:
            raise NotFound("Patient doesn't exists")
        if not doctor:
            raise NotFound("Doctor doesn't exists")

        ratings = Ratings.objects.filter(patient=patient, doctor=doctor).first()
        serializerRatings = RatingSerializer(data=request.data)
        serializerRatings.is_valid(raise_exception=True)
        # print(serializerRatings.data)

        if not ratings:
            serializerRatings.save()
            ratingsData = serializerRatings.data
            ratings = Ratings.objects.get(id=ratingsData['id'])
            ratings.patient=patient
            ratings.doctor = doctor
        else:
            #Ensuring only one feedback per user
            return Response({'error':True,'message':'You\'ve already given the feedback'},status = status.HTTP_400_BAD_REQUEST)
        
        ratings.save()
        return Response({'success':True,'message':'Thankyou for your feedback.'},status=status.HTTP_200_OK)
class LicenceVerificationView(APIView):
    def post(self,request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('User Unauthenticated')
        try:
            payload = jwt.decode(token,'secret',algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired')
        
        user = User.objects.filter(id=payload['id']).first()

        if not user.is_superuser:
            return Response({'error':True,'message':'Not Authorized'},status = status.HTTP_401_UNAUTHORIZED)

        doctor = Profile.objects.filter(id=request.data["doctor_id"]).first()
        license = Licence.objects.get(doctor=doctor)

        if not doctor:
            raise NotFound("Doctor doesn't exists")

        license.is_verified = not license.is_verified 
        license.save()

        return Response({'success':True,'message':'Doctor status updated successfully!'},status=status.HTTP_200_OK)

class LicenceView(APIView):
    def get(self,request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('User Unauthenticated')
        try:
            payload = jwt.decode(token,'secret',algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired')
        
        user = User.objects.filter(id=payload['id']).first()

        if not user.is_superuser:
            return Response({'error':True,'message':'Not Authorized'},status = status.HTTP_401_UNAUTHORIZED)

        profile = Profile.objects.all()
        doctors = User.objects.filter(profile__in=profile).all()
        print('doctors->>.',doctors)
        serializer = DoctorLicenceSerializer(doctors,many=True)

        response = {'results':serializer.data}

        return Response(response,status=status.HTTP_200_OK)

class FeedbackView(APIView):
    def post(self,request,doctor_id):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('User Unauthenticated')
        try:
            payload = jwt.decode(token,'secret',algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired')

        patient = PatientProfile.objects.filter(user_id = payload['id']).first()
        doctor = Profile.objects.filter(id = doctor_id).first()
        date=datetime.date.today()

        if not patient:
            raise NotFound("Patient doesn't exists")
        if not doctor:
            raise NotFound("Doctor doesn't exists")

        feedback = Feedback.objects.filter(doctor=doctor,patient=patient,date=date).first()
        serializerFeedback = FeedbackSerializer(data = request.data)
        serializerFeedback.is_valid(raise_exception = True)
        
        if not feedback:
            serializerFeedback.save()
            feedbackData = serializerFeedback.data
            feedback = Feedback.objects.get(id=feedbackData['id'])
            feedback.patient=patient
            feedback.doctor = doctor
            feedback.date = date
        else:
            return Response({"Error":"True","message":"You have already given your feedback"},status=status.HTTP_400_BAD_REQUEST)
        
        feedback.save()
        return Response({"Success":"True","message":"Thanks for your feedback."},status=status.HTTP_200_OK)

class GetFeedbackView(APIView):
    def get(self,request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('User Unauthenticated')
        try:
            payload = jwt.decode(token,'secret',algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired')
        user = User.objects.filter(id=payload['id']).first()
        patient = PatientProfile.objects.filter(user=user).first()
        patient_id = patient.id
        feedback = Feedback.objects.filter(patient_id=patient_id)

        if not feedback:
            return Response({"Error":"You havent submitted any feedback."},status=status.HTTP_400_BAD_REQUEST)
        
        serializer = FeedbackResponseSerializer(feedback,many=True).data
        
        response = Response()
        response.data={
            
            'response':serializer

        }
        return response




#Getting the overall feedback of any doctor through their doctor_id.
class GetRatingsView(APIView):

    def get(self,request,doctor_id):
        
        doctor = Profile.objects.filter(id=doctor_id).first()
        if not doctor:
            raise NotFound("Doctor doesn't exists")

        totalRatings = Ratings.objects.filter(doctor = doctor).aggregate(Sum('ratings')) #Getting the total sum of ratings
        ratingsCount = Ratings.objects.filter(doctor = doctor).count() #Getting the total count of all ratings
        ratings = totalRatings['ratings__sum']/ratingsCount #Calculating the average


        # serializer = RatingsSerializer(doctor)
        response = Response()
        response.data = {
            'ratings': ratings
        }
        return response
