from django.urls import path
from .views import AddMedicaRecordView, PatientProfileView,EditPatientProfileView,DeleteMedicaRecordView,AllMedicaRecordsView

urlpatterns = [
    path('patient-profile',PatientProfileView.as_view(),name='PatientProfile'),
    path('edit-patient-profile',EditPatientProfileView.as_view(),name='EditPatientProfile'),
    path('add-medical-record',AddMedicaRecordView.as_view(),name='AddMedicalRecord'),
    path('delete-medical-record',DeleteMedicaRecordView.as_view(),name='DeleteMedicalRecord'),
    path('medical-records',AllMedicaRecordsView.as_view(),name='MedicalRecords')
]

