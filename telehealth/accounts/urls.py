from django.urls import path
from .views import RegisterView, LoginView, RequestPasswordResetEmail,SetNewPasswordAPIView,UserView, LogoutView,VerifyEmail,PasswordTokenCheckAPI

urlpatterns = [
    path('register',RegisterView.as_view(),name='register'),
    path('login',LoginView.as_view(),name='login'),
    path('user', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('email-verify/',VerifyEmail.as_view(),name='email-verify'),
    path('request-reset-email',RequestPasswordResetEmail.as_view(),name="request-reset-email"),
    path('password-reset/<uidb64>/<token>/',PasswordTokenCheckAPI.as_view(),name = 'password-reset-confirm'),
    path('password-reset-complete',SetNewPasswordAPIView.as_view(),name='password-reset-complete')

]
