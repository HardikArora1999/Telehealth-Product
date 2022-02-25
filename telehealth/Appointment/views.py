from copy import error
from django.db.models.fields import NullBooleanField
from django.db.models.query import EmptyQuerySet
from django.db.models.query_utils import Q
from Patient.serializers import PatientProfileSerializer
from Patient.models import PatientProfile
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status, serializers
from rest_framework.exceptions import AuthenticationFailed, NotFound
import jwt
from .models import Appointment
from doctor.models import Profile
from .serializers import AppointmentSerializer, DoctorAppointmentSerializer, PatientAppointmentSerializer
from rest_framework.response import Response
import datetime
from django.db import IntegrityError
from twilio.rest import Client
from .models import Appointment
from accounts.models import User
import pytz
#from twilio.http.http_client import TwilioHttpClient
import os
import sms
import messagebird
import http.client

#Book an appointment
class AppointmentView(APIView):
    def post(self,request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('User Unauthenticated!')
        try:
            payload = jwt.decode(token, 'secret', algorithms='HS256')

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired!')
        
        requestData = request.data.copy()

        # print(requestData)
        # serializer = AppointmentSerializer(data=request.data)
        # serializer.is_valid(raise_exception=True)
        # print(serializer.data)
        # serializer.is_available=False
        print('payload',payload['id'])

        # serializer.patient = patient

       
        #serializer.doctor = doctor
        
        
        user = User.objects.filter(id=payload['id']).first()
        profile = PatientProfile.objects.filter(user=user).first()
        
        patient = PatientProfile.objects.filter(user_id=payload['id']).first()
        if patient is None:
            return Response({"error":True, "message":"Patient can not be found."},status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        time_zone = pytz.timezone('Asia/Kolkata')
        time = datetime.datetime.now(tz=time_zone)
        date= time.date()
        # current_time = time.hour
        # current_time = f'{str(time.hour)}:{str(time.minute)}'
        appointment_time=datetime.datetime.strptime(requestData['start_time'],'%H:%M')
        appointment = Appointment.objects.filter(patient=patient , date=requestData['date'], start_time=requestData['start_time']).first()
        # print(appointment_time.time()<time.time())
        if appointment or ( appointment_time.time()<time.time() and str(date)==requestData['date'] ):
            return Response({"error":True, "message":"Can't Book this Slot!"},status=status.HTTP_400_BAD_REQUEST)
        doctor = Profile.objects.filter(id=requestData["doctor_id"]).first()
        appointment = Appointment()
  
        appointment.patient=patient
        appointment.doctor=doctor
        appointment.date=requestData['date']
        appointment.start_time=appointment_time.time()
        appointment.is_available=False 
        appointment.save()
      


        # time_zone = pytz.timezone('Asia/Kolkata')
        # time = datetime.datetime.now(tz=time_zone)
        # current_time = time.hour
        # current_date=time.date()

        # print("start")
        # doctor = Profile.objects.filter(id=requestData['doctor_id']).first()
        # patient = PatientProfile.objects.filter(user_id=payload['id']).first()
        # appointment = Appointment.objects.filter(doctor=doctor , date=requestData['date'],
        # start_time=requestData['start_time'],end_time=requestData['end_time']).first()
        
        # #print(not appointment, appointment.start_time<=current_time,  appointment.date, appointment.is_available)
        # if not appointment or (appointment.start_time <= current_time and appointment.date==current_date) or appointment.date < current_date or not appointment.is_available:
        #     return Response({'error':True,"message":"Can not book this slot"},status=status.HTTP_400_BAD_REQUEST)
      

        # appointment.patient = patient
        # appointment.is_available = False
        # appointment.save()
        return Response({'success':True,'message':'appointment booked successfully'},status=status.HTTP_200_OK)

    #generating empty slots everyday 
    # def generateSlots():
    #     print("Generating Slots...")
    #     doctors = Profile.objects.all()
    #     time_zone = pytz.timezone('Asia/Kolkata')
    #     time = datetime.datetime.now(tz=time_zone)
    #     todayDate=time.date()
    #     tomorrowDate = todayDate + datetime.timedelta(days=1)
    #     todaySlots = Appointment.objects.filter(date=todayDate).first()
    #     tomorrowSlots = Appointment.objects.filter(date=tomorrowDate).first()

    #     def createSlots(date):
    #         for doctor in doctors:
    #             # print(doctor)
    #             for i in range(8,17):
                    
    #                 serializer = Appointment(start_time=i, end_time=i+1, date=date, doctor_id=doctor.id)
    #                 # print('Genreated')
    #                 # print(serializer.end_time)
    #                 serializer.is_available=True
    #                 # print('saved')
    #                 serializer.save()

    #     if not todaySlots:
        #     print("Creating today's slots...")
        #     createSlots(todayDate)
        # if not tomorrowSlots:
        #     print("Creating tomorrow's slots...")
        #     createSlots(tomorrowDate)
        # print("Slot creation Done")
        

#Get all appointments of a doctor
class GetDoctorPastAppointmentsView(APIView):
    def get(self,request):
        token =  request.COOKIES.get('jwt')
        if token == None:
            raise AuthenticationFailed('User Unauthenticated')
        try:
            payload = jwt.decode(token,'secret',algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired')

        time_zone = pytz.timezone('Asia/Kolkata')
        time = datetime.datetime.now(tz=time_zone)-datetime.timedelta(minutes=10)
        date= time.date()
        # current_time = time.hour
        # current_time = f'{str(time.hour)}:{str(time.minute)}'
        
        doctor = Profile.objects.filter(id=payload['id']).first()
        appointment = Appointment.objects.filter(Q(date__lt=date) | (Q(date=date) & Q(start_time__lt=time.time())),doctor = doctor,is_available=False).order_by("-date").order_by("-start_time")
        # print(appointment)
        if not appointment:
            # raise EmptyQuerySet("No appointments found!")
            return Response({"error":"No appointments found!"},status=status.HTTP_400_BAD_REQUEST)

        serializer = DoctorAppointmentSerializer(appointment,many=True)
        response = Response()
        response.data = {

            'result': serializer.data
        }
        return response
class GetDoctorFutureAppointmentsView(APIView):
    def get(self,request):
        token =  request.COOKIES.get('jwt')
        if token == None:
            raise AuthenticationFailed('User Unauthenticated')
        try:
            payload = jwt.decode(token,'secret',algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired')

        time_zone = pytz.timezone('Asia/Kolkata')
        time = datetime.datetime.now(tz=time_zone)-datetime.timedelta(minutes=10)
        date= time.date()
        # current_time = time.hour
        # current_time = f'{str(time.hour)}:{str(time.minute)}'
        
        doctor = Profile.objects.filter(id=payload['id']).first()
        appointment = Appointment.objects.filter((Q(date=date) & Q(start_time__gte=time.time())) | Q(date__gt=date),doctor = doctor,is_available=False).order_by("-date").order_by("-start_time")
        # print(appointment)
        if not appointment:
            # raise EmptyQuerySet("No appointments found!")
            return Response({"error":"No appointments found!"},status=status.HTTP_400_BAD_REQUEST)

        serializer = DoctorAppointmentSerializer(appointment,many=True)
        response = Response()
        response.data = {

            'result': serializer.data
        }
        return response
        

# Get all appointments of a patient        
class GetPatientPastAppointmentView(APIView):
    def get(self,request):
        
        token =  request.COOKIES.get('jwt')
        if token == None:
            raise AuthenticationFailed('User Unauthenticated')
        try:
            payload = jwt.decode(token,'secret',algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired')

        time_zone = pytz.timezone('Asia/Kolkata')
        time = datetime.datetime.now(tz=time_zone)-datetime.timedelta(minutes=10)
        date= time.date()
        # current_time = time.hour
        # current_time = f'{str(time.hour)}:{str(time.minute)}'
        # print(current_time)
        patient = PatientProfile.objects.filter( user_id = payload['id']).first()
        appointment = Appointment.objects.filter(Q(date__lt=date) | (Q(date=date) & Q(start_time__lt=time.time())),patient=patient).order_by("-date").order_by("-start_time")
        if not appointment:
            # raise EmptyQuerySet("No appointment found!")
            return Response({"error":"No appointments found!"},status=status.HTTP_400_BAD_REQUEST)

        serializer = PatientAppointmentSerializer(appointment,many=True)
        response = Response()
        response.data = {

            'result': serializer.data
        }
        return response

class GetPatientFutureAppointmentView(APIView):
    def get(self,request):
        
        token =  request.COOKIES.get('jwt')
        if token == None:
            raise AuthenticationFailed('User Unauthenticated')
        try:
            payload = jwt.decode(token,'secret',algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired')
        
        time_zone = pytz.timezone('Asia/Kolkata')
        time = datetime.datetime.now(tz=time_zone)-datetime.timedelta(minutes=10)
        date= time.date()
        # current_time = time.hour
        # current_time = f'{str(time.hour)}:{str(time.minute)}'
        # print(current_time)
        patient = PatientProfile.objects.filter( user_id = payload['id']).first()
        appointment = Appointment.objects.filter((Q(date=date) & Q(start_time__gte=time.time())) | Q(date__gt=date),patient=patient).order_by("-date")
        if not appointment:
            # raise EmptyQuerySet("No appointment found!")
            return Response({"error":"No Upcoming Appointments Found!"},status=status.HTTP_400_BAD_REQUEST)

        serializer = PatientAppointmentSerializer(appointment,many=True)
        response = Response()
        response.data = {

            'result': serializer.data
        }
        return response

#Get all empty slots        
class GetSlotsView(APIView):
    def get(self,request):

        print(request.data)

        doctorId = request.GET.get('doctor_id')
        print(doctorId)
        time_zone = pytz.timezone('Asia/Kolkata')
        time = datetime.datetime.now(tz=time_zone)-datetime.timedelta(minutes=10)
        date= time.date()
        doctor = Profile.objects.filter(id=doctorId).first()
        print(date)
        appointment=Appointment.objects.filter(date__gte=date,doctor=doctor)
        print(appointment)
        if appointment == []:
            return Response({"Success":"True","message":"All slots are free."},status=status.HTTP_400_BAD_REQUEST)
        serializer = AppointmentSerializer(appointment,many=True)
        response = Response()
        response.data = serializer.data 
        return response
        

        # time_zone = pytz.timezone('Asia/Kolkata')
        # time = datetime.datetime.now(tz=time_zone)
        # todayDate = time.date()
        # tomorrowDate = todayDate + datetime.timedelta(days=1)

        # todaySlots = Appointment.objects.filter( date = todayDate, doctor = doctor).order_by('id')
        # tomorrowSlots = Appointment.objects.filter( date = tomorrowDate, doctor = doctor).order_by('id')
        
        # serializerTodaySlots = AppointmentSerializer(todaySlots,many=True)
        # serializerTomorrowSlots = AppointmentSerializer(tomorrowSlots,many=True)

        # response = Response()
        # response.data = {
        #     'today_slots': serializerTodaySlots.data,
        #     'tomorrow_slots' : serializerTomorrowSlots.data 
        # }
        # return response

# Slot deleting option for a particular doctor
class DeleteSlotsView(APIView):
    def get(self,request):
        token =  request.COOKIES.get('jwt')
        if token == None:
            raise AuthenticationFailed('User Unauthenticated')
        try:
            payload = jwt.decode(token,'secret',algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired, Login again!')
        
        time = datetime.datetime.now()
        curr_time = time.hour
        
        doctor = Profile.objects.filter(user_id=payload['id'])
        date=datetime.date.today()
        myslots = Appointment.objects.filter(doctor__in = doctor, date =date, start_time__gte=curr_time+1)
        print(myslots)
        for slot in myslots:
            slot.is_available = False
            slot.save()
        return Response({'success':"Slots Deleted successfully"},status=status.HTTP_200_OK)

# Sending Reminder
class ReminderView(APIView):
    def send_reminder():
        conn = http.client.HTTPSConnection("api.authkey.io")

        time_zone = pytz.timezone('Asia/Kolkata')
        time = datetime.datetime.now(tz=time_zone)
        Date=time.date()

        appointments = Appointment.objects.filter(date = Date,is_available=False)
        if not appointments:
            return

        for appointment in appointments:
            doctor_id = appointment.doctor_id
            patient_id = appointment.patient_id
            # print(doctor_id)
            # print(patient_id)
            doctor = Profile.objects.filter(id=doctor_id).first()
            patient = PatientProfile.objects.filter(id=patient_id).first()
            user_id2 = doctor.user_id
            user_id = patient.user_id
            user2 = User.objects.filter(id=user_id2).first()
            user = User.objects.filter(id=user_id).first()
            
            start_time=appointment.start_time
            if start_time>12:
                start_time=start_time-12
            if start_time<12:
                start = str(start_time)+"am"
            else:
                start = str(start_time)+"pm"

            # print("Sending reminder to: ",user.first_name)
            url = f"/request?authkey=106a1bad82423bff&mobile={user.phone_number}&country_code=91&sid=1096&name={user.first_name}&date={appointment.date}&doctorName={user2.first_name+user2.last_name}&time={start}"
            conn.request("GET", url)

            res = conn.getresponse()
            data = res.read()

            print(data.decode("utf-8"))
        
