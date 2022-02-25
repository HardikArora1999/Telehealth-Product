from django.urls import path

from .views import VideoTokenView, RequestChatBotView

urlpatterns = [
    path('video/token',VideoTokenView.as_view(),name='Video Token'),
    path('chatbot',RequestChatBotView.as_view(),name="Chatbot Response")
]