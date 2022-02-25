from django.urls import path

from .views import AppointmentView,GetDoctorPastAppointmentsView,GetSlotsView,GetPatientPastAppointmentView,DeleteSlotsView,GetPatientFutureAppointmentView, GetDoctorFutureAppointmentsView

urlpatterns = [

    path('book-appointment',AppointmentView.as_view(),name='book-appointment'),
    path('doctor-appointments',GetDoctorPastAppointmentsView.as_view(),name='Get-doctor-appointments'),
    path('patient-appointments',GetPatientPastAppointmentView.as_view(),name='Get-patient-appointments'),
    path('doctor-slots',GetSlotsView.as_view(),name='GetAllEmptySlots'),
    path('delete-Slots',DeleteSlotsView.as_view(),name='deleteSlots'),
    path('patient-upcoming-appointments',GetPatientFutureAppointmentView.as_view(), name="Upcoming Patient Appointments"),
    path('doctor-upcoming-appointments',GetDoctorFutureAppointmentsView.as_view(), name="Upcoming Doctor Appointments")
]