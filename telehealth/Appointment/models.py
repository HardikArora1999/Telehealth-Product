# from typing_extensions import Required
from doctor.models import Profile
from django.db import models
from Patient.models import PatientProfile
from doctor.models import Profile

class Appointment(models.Model):
    doctor = models.ForeignKey(Profile,null=True,blank=True,on_delete=models.CASCADE)
    patient = models.ForeignKey(PatientProfile,null=True,blank=True,on_delete=models.CASCADE)
    start_time = models.TimeField()
    # end_time = models.CharField(max_length=10)
    date = models.DateField()
    is_available = models.BooleanField(default=True)
    REQUIRED_FIELDS = []

    