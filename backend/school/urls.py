from django.urls import include, path

from school.views import AppStatusView, SchoolAPIView, UserAPIView

urlpatterns = [
    path("status", AppStatusView.as_view(), name="app_status"),
    path("user_onboarding", UserAPIView.as_view(), name="user_onboarding"),
    path("", SchoolAPIView.as_view(), name="school_onboarding"),
]
