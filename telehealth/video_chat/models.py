from Appointment.models import Appointment
from django.db import models

# Create your models here.

class Room(models.Model):
    appointment = models.ForeignKey(Appointment,null=True,blank=True,on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    REQUIRED_FIELDS = []
