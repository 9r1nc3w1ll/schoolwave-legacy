from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import AdminResetPassword, ChangePassword, FetchUser, LoginAPIView

urlpatterns = [
    path("login", LoginAPIView.as_view()),
    path("token/refresh", TokenRefreshView.as_view()),
    path("user", FetchUser.as_view()),
    path("password/change", ChangePassword.as_view()),
    path("password/admin_reset", AdminResetPassword.as_view())
]