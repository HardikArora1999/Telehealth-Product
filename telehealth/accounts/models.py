from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator, RegexValidator

# Create your models here.

class User(AbstractUser):
    is_doctor = models.BooleanField(default=False)
    email = models.EmailField(max_length=255, unique=True)
    is_verified = models.BooleanField(default=False)
    password = models.CharField(max_length=255)
    phone_regex = RegexValidator(regex=r'^\+?1?\d{10,10}$', message="Phone number must be entered in the format: '+9999999999'. Only 10 digits allowed.")
    phone_number = models.CharField(validators=[phone_regex], max_length=60, blank=True)
    username = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []