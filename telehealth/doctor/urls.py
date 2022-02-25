from django.urls import path
from .views import RatingsView,GetRatingsView,EditProfileOnRegistrationView,ProfileView,DoctorsListView,GetDoctorView,LicenceView,LicenceVerificationView,EditProfileView
from .views import FeedbackView,GetFeedbackView

urlpatterns = [
    path('edit-doctor-profile',EditProfileOnRegistrationView.as_view(),name='Edit Profile'),
    path('edit-profile-doctor',EditProfileView.as_view(),name='Edit doctor Profile'),
    path('doctor-profile',ProfileView.as_view(),name='View Profile'),
    path('get-doctors',DoctorsListView.as_view(),name='Doctors List'),
    path('ratings/<int:doctor_id>',RatingsView.as_view(),name='Ratings'),
    path('getratings/<int:doctor_id>',GetRatingsView.as_view(),name='getRatings'),
    path('get-doctor',GetDoctorView.as_view(),name='getRatings'),
    path('feedback/<int:doctor_id>',FeedbackView.as_view(),name='feedback'),
    path('feedback',GetFeedbackView.as_view(),name='get-feedback'),
    path('get-doctor',GetDoctorView.as_view(),name='getRatings'),
    path('doctor-licence-verification',LicenceVerificationView.as_view(),name='Doctor Licence Verification'),
    path('doctors-status',LicenceView.as_view(),name='Doctors List from admin')

]
