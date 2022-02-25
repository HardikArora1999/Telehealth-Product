from Patient.models import PatientProfile
from django.db import models
from django.db.models import fields
from rest_framework import  serializers
from .models import Appointment
from accounts.models import User
from doctor.models import Profile, Specialization
class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields=['id','start_time','date','is_available']

class DoctorSerializer(serializers.ModelSerializer):
    specialization = serializers.SerializerMethodField('get_specialization')

    def get_specialization(self, user):
        qs = Specialization.objects.filter(user=user).first()
        return qs.name
    class Meta:
        model = User
        fields=['id','first_name','last_name','specialization']

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields=['id','first_name','last_name']
class PatientAppointmentSerializer(serializers.ModelSerializer):
    doctor_details = serializers.SerializerMethodField('get_doctor')

    def get_doctor(self, appointment):
        doctorProfile = Profile.objects.filter(appointment=appointment).first()
        doctor = User.objects.filter(profile=doctorProfile).first()
        doctor_data = DoctorSerializer(doctor).data
        doctor_data["doctor_id"]=doctorProfile.id
        return doctor_data
    class Meta:
        model = Appointment
        fields = ['id','start_time','date','is_available','doctor_details']

class DoctorAppointmentSerializer(serializers.ModelSerializer):
    patient_details = serializers.SerializerMethodField('get_patient')

    def get_patient(self, appointment):
        patientProfile = PatientProfile.objects.filter(appointment=appointment).first()
        patient = User.objects.filter(patientprofile=patientProfile).first()
        patient_data = PatientSerializer(patient).data
        return patient_data
    class Meta:
        model = Appointment
        fields = ['id','start_time','date','is_available','patient_details']
