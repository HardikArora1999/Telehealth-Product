from django.db import models
from django.db.models import fields, Sum
from django.utils import tree
from rest_framework import  serializers
from .models import Licence, Feedback, Profile, Specialization,Ratings
from accounts.models import User
from accounts.serializers import UserSerializer

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = ['id','name']

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['id', 'dob', 'years_of_experience', 'image', 'degree','description','fee']

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ratings
        fields = ['id','ratings']

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ['id','review',"date"]
        # extra_kwargs = {'reviews': {'required': False}}

class FeedbackResponseSerializer(serializers.ModelSerializer):
    doctor = serializers.SerializerMethodField()
    def get_doctor(self,obj):
        doctor = Profile.objects.filter(id=obj.doctor_id).first()
        user = User.objects.filter(id=doctor.user_id).first()
        first_name=user.first_name
        last_name=user.last_name
        return "Dr"+" "+ first_name+" "+last_name
    class Meta:
        model=Feedback
        fields = ['id','doctor','patient','review','date']

class DoctorSerializer(serializers.ModelSerializer):
    specialization = serializers.SerializerMethodField('get_specialization')
    ratings = serializers.SerializerMethodField('get_ratings')
    doctor_details = serializers.SerializerMethodField('get_doctorDetails')

    def get_specialization(self, user):
        qs = Specialization.objects.filter(user=user).first()
        return qs.name

    def get_ratings(self,user):
        doctor = Profile.objects.filter(user=user).first()
        ratings = 0
        if doctor:
            totalRatings = Ratings.objects.filter(doctor=doctor).aggregate(Sum('ratings'))
            ratingsCount = Ratings.objects.filter(doctor = doctor).count() 
            if totalRatings['ratings__sum']:
                ratings = totalRatings['ratings__sum']/ratingsCount
        
        return ratings
    
    def get_doctorDetails(self,user):
        doctor = Profile.objects.filter(user=user).first()
        doctor_data = ProfileSerializer(doctor).data
        return doctor_data
    class Meta:
        model = User
        fields = ['id', 'first_name','last_name', 'is_doctor', 'email','specialization','ratings','doctor_details']

class DoctorLicenceSerializer(serializers.ModelSerializer):
    specialization = serializers.SerializerMethodField('get_specialization')
    doctor_details = serializers.SerializerMethodField('get_doctorDetails')
    # is_verified = serializers.SerializerMethodField('get_status')
    def get_specialization(self, user):
        qs = Specialization.objects.filter(user=user).first()
        return qs.name
    
    # def get_status(self, user):
    #     qs = Specialization.objects.filter(user=user).first()
    #     return qs.name
    
    def get_doctorDetails(self,user):
        doctor = Profile.objects.filter(user=user).first()
        licence = Licence.objects.filter(doctor=doctor).first()
        doctor_data = ProfileSerializer(doctor).data
        licence_data = {'licence_number':None,'is_verified':None}
        if licence:
           licence_data['licence_number'] = licence.number
           licence_data['is_verified'] =  licence.is_verified
        doctor_data['licence_details'] = licence_data
        return doctor_data
    class Meta:
        model = User
        fields = ['id', 'first_name','last_name', 'email','specialization','doctor_details']
