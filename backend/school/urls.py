from school.views import UserAPIView, SchoolAPIView, AppStatusView
from django.urls import path, include

urlpatterns=[
    path('user_onboarding/', UserAPIView.as_view(), name='user_onboarding'),
    path('schools/', SchoolAPIView.as_view(), name='school_onboarding'),
    path('app_status/', AppStatusView.as_view(), name='app_status'),
]

