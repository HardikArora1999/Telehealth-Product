from .models import PatientProfile, MedicalRecord
from rest_framework import serializers
# from rest_framework.utils import field_mapping

class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = ['id','dob','employment', 'image','description']


class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = ['id','name','file']
