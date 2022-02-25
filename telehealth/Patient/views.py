from .models import MedicalRecord, PatientProfile
from django.shortcuts import render
from rest_framework import serializers, status
from rest_framework.views import APIView
from accounts.serializers import UserSerializer
from .serializers import MedicalRecordSerializer, PatientProfileSerializer
from rest_framework.exceptions import APIException, AuthenticationFailed
import jwt
from accounts.models import User
from rest_framework.response import Response
from django.core.files.storage import default_storage

#Edit profile
class EditPatientProfileView(APIView):
    def post(self,request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('User Unauthenticated')
        try:
            payload = jwt.decode(token,'secret',algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired')
        
        requestData = request.data.copy()
        imageName = str(requestData['image'])

        user = User.objects.filter(id=payload['id']).first()
        try:
            user.phone_number = requestData['phone_number']
            user.full_clean()
            user.save()
        except Exception as e:
            exception = APIException("Phone number must be entered in the format: '+9999999999'. Only 10 digits allowed.")
            exception.status_code = 400
            raise exception
        requestData.pop('phone_number')

        if imageName:
            fileExt = imageName.split(".")[1]
            fileName = f'{str(user.id)}_image.{fileExt}'
            requestData['image'].name = fileName

        patient = PatientProfile.objects.filter(user=user).first()
        serializerProfile = PatientProfileSerializer(data=requestData)
        serializerProfile.is_valid(raise_exception=True)

        if not patient:
            serializerProfile.save()
            Patientprofile = serializerProfile.data
            patient = PatientProfile.objects.get(id=Patientprofile['id'])
            patient.user = user
        else:
            Patient_data = serializerProfile.data
            if imageName:
                if default_storage.exists(patient.image.name):
                    patient.image.delete()
                Patient_data['image'] = requestData['image']
            else:
                Patient_data.pop('image')

            for(key,value) in Patient_data.items():
                setattr(patient,key,value)
        
        patient.save()


        
        return Response({'success':True,'message':'profile updated successfully'},status=status.HTTP_200_OK)


#view profile
class PatientProfileView(APIView):

    def get(self,request):
        token =  request.COOKIES.get('jwt')
        if token == None:
            raise AuthenticationFailed('User Unauthenticated')
        try:
            payload = jwt.decode(token,'secret',algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired')

        user = User.objects.filter(id=payload['id']).first()
        patient = PatientProfile.objects.filter(user=user).first()

        serializer = PatientProfileSerializer(user)
        response = Response()
        response.data = {
            'user': UserSerializer(user).data,
            'profile': PatientProfileSerializer(patient).data
        }
        return response


class AddMedicaRecordView(APIView):
    def post(self,request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('User Unauthenticated')
        try:
            payload = jwt.decode(token,'secret',algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired')
        
        requestData = request.data.copy()
        fileName = str(requestData['file'])

        user = User.objects.filter(id=payload['id']).first()
        patient = PatientProfile.objects.filter(user=user).first()
        records = MedicalRecord.objects.filter(patient=patient).count()
        # print(records)
        if fileName:
            fileExt = fileName.split(".")[1]
            fileName = f'patient_{str(patient.id)}_record_{records+1}.{fileExt}'
            requestData['file'].name = fileName
        # print(requestData['file'].name)
        serializer = MedicalRecordSerializer(data=requestData)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        record = serializer.data
        medicalRecord = MedicalRecord.objects.get(id=record['id'])
        medicalRecord.patient = patient
        medicalRecord.save()
        return Response({'success':True,'message':'Medical Record added successfully'},status=status.HTTP_200_OK)

class DeleteMedicaRecordView(APIView):
    def delete(self,request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('User Unauthenticated')
        try:
            payload = jwt.decode(token,'secret',algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired')
        
        MedicalRecordId = request.GET.get('medical_record_id')

        try:
            record = MedicalRecord.objects.get(id=MedicalRecordId)
            if default_storage.exists(record.file.name):
                record.file.delete()
                record.delete()
        except:
            return Response({'error':True,'message':'Medical Record Does not Exists'},status=status.HTTP_404_NOT_FOUND)

        return Response({'success':True,'message':'medical record deleted successfully'},status=status.HTTP_200_OK)

class AllMedicaRecordsView(APIView):
    def get(self,request):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('User Unauthenticated')
        try:
            payload = jwt.decode(token,'secret',algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Expired')
        
        MedicalRecordId = request.GET.get('medical_record_id')

        user = User.objects.filter(id=payload['id']).first()
        patient = PatientProfile.objects.filter(user=user).first()
        records = MedicalRecord.objects.filter(patient=patient).all()

        if not records:
            return Response({'error':True,'message':'No Medical Record Found'},status=status.HTTP_404_NOT_FOUND)

        serializer = MedicalRecordSerializer(records,many=True)
        
        return Response({'results':serializer.data},status=status.HTTP_200_OK)