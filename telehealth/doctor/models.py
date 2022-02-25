from django.db import models
from accounts.models import User
from Patient.models import PatientProfile
# Create your models here.
class Specialization(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE,related_name='specialization_name')

class Profile(models.Model):
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    dob = models.DateField(null=True)
    years_of_experience = models.IntegerField(null=True)
    image = models.FileField(null=True, blank=True,upload_to='users/profile-images')
    degree = models.CharField(max_length=255)
    description = models.TextField(null=True)
    fee = models.IntegerField(default=0)
    REQUIRED_FIELDS = []

class Ratings(models.Model):
    patient = models.ForeignKey(PatientProfile,blank=True, null=True,on_delete=models.CASCADE)
    doctor = models.ForeignKey(Profile ,blank=True, null=True, on_delete=models.CASCADE)
    ratings = models.IntegerField(choices=zip(range(1,6),range(1,6)))

class Feedback(models.Model):
    patient = models.ForeignKey(PatientProfile,blank=True, null=True,on_delete=models.CASCADE)
    doctor = models.ForeignKey(Profile ,blank=True, null=True, on_delete=models.CASCADE)
    review = models.CharField(null=True , max_length=255)
    date = models.DateField(null=True)
   
class Licence(models.Model):
    doctor = models.ForeignKey(Profile, blank=True, null=True, on_delete=models.CASCADE)
    number = models.CharField(max_length=255)
    is_verified = models.BooleanField(default=False)
    REQUIRED_FIELDS = []