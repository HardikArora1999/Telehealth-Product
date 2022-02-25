from django.db import models
from accounts.models import User

#Database model for Patient Profile
class PatientProfile(models.Model):
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    dob = models.DateField(max_length=8)
    employment = models.CharField(max_length=200)
    description = models.TextField(max_length=500)
    image = models.FileField(null=True, blank=True,upload_to='users/profile-images')
    
class MedicalRecord(models.Model):
    patient = models.ForeignKey(PatientProfile,null=True,blank=True,on_delete=models.CASCADE)
    name = models.CharField(max_length=60)
    file = models.FileField(null=True, blank=True,upload_to='users/patient-medical-records')