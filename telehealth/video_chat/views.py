import datetime

import pytz
from video_chat.serializers import RoomSerializer

from rest_framework.serializers import Serializer
from video_chat.models import Room
from Appointment.models import Appointment
from accounts.models import User
from django.shortcuts import render
import jwt
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.views import APIView
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant
from rest_framework import status
import uuid
import requests

# Create your views here.

class VideoTokenView(APIView):
    def post(self,request):
        # required for all twilio access tokens
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('User Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired!')

        user = User.objects.filter(id=payload['id']).first()
        appointment = Appointment.objects.filter(id=request.data['appointment_id']).first()
        
        time_zone = pytz.timezone('Asia/Kolkata')
        time = datetime.datetime.now(tz=time_zone)
        date= time.date()
        # current_time = time.hour
        # current_time = f'{str(time.hour)}:{str(time.minute)}'
        
        if appointment.start_time>time.time() or appointment.date!=date:
            return Response({'error':True,"message":"Can not join the room, try again later"},status=status.HTTP_503_SERVICE_UNAVAILABLE)

        room = Room.objects.filter(appointment=appointment).first()
        if not room:
            print("room created")
            # room = Room(name=str(uuid.uuid1()),appointment=appointment)
            serializer = RoomSerializer(data={"name":str(uuid.uuid1())})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            room_data = serializer.data
            room = Room.objects.get(id=room_data["id"])
            room.appointment = appointment
            room.save()

        account_sid = 'ACab6831fcc82250ec0e4f633d145b868c'
        api_key = 'SK0d2306e3b13e3775b0ae0244e4c7a449'
        api_secret = 'PA3nDrsCOBIN0OXiHpfeYpp0tjKkXsrh'

        identity = user.first_name
        roomName = room.name
        # Create access token with credentials
        token = AccessToken(account_sid, api_key, api_secret, identity=identity)

        # Create a Video grant and add to token
        video_grant = VideoGrant(room=roomName)
        token.add_grant(video_grant)

        # Return token info as JSON
        response = Response()
        response.data = {

            'token':  token.to_jwt(),
            'room_name': roomName
        }
        return response

class RequestChatBotView(APIView):
    def post(self,request):
        url = "https://generic-backend-9135.twil.io/generic_chat"
        myobj = {'message': request.data['message']}
        ans =requests.post(url,data=myobj)
        print(request.data['message'])
        # print(ans.json())
        return Response(ans.json())

        