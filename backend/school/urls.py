from school.views import UserAPIView, SchoolAPIView, AppStatusView
from django.urls import path, include

urlpatterns=[
    path('status', AppStatusView.as_view(), name='app_status'),
    path('user_onboarding', UserAPIView.as_view(), name='user_onboarding'),
    path('', SchoolAPIView.as_view(), name='school_onboarding'),
]

