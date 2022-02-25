  
from django.contrib.auth import tokens
from django.core.exceptions import FieldError
from django.db.models.fields import EmailField
from rest_framework import exceptions, serializers
from rest_framework.utils import field_mapping
from .models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str,force_str,smart_bytes,DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name','last_name', 'is_doctor', 'email', 'password','phone_number','is_superuser']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

class RequestPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)
        
    class Meta:
        field = ["email"]

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6,max_length=68,write_only=True)
    token = serializers.CharField(min_length=1,write_only=True)
    uidb64 = serializers.CharField(min_length=1,write_only=True)

    class Meta:
        fields = ['password','token','uidb64']

    def validate(self,attrs):
        try:
            password = attrs.get('password')
            token=attrs.get('token')
            uidb64 = attrs.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64)) #converting into a human readable form
            user = User.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user,token): #checking if not it is already in use
                raise exceptions.AuthenticationFailed('The reset link is invalid.',401)

            user.set_password(password) #Setting new password in the database
            user.save()  # saving the changes
            return (user)

        except Exception as e:
            raise exceptions.AuthenticationFailed('The reset link is invalid.',401)
            

        return super().validate(attrs)
        