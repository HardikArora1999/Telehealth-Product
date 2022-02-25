from video_chat.models import Room
from django.db import models
from rest_framework import  serializers

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id','name']