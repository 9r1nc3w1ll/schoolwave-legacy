from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from account.views import (
    AdminResetPassword,
    ChangePassword,
    FetchUser,
    LoginView,
    RetrieveUpdateDestroyUser,
    UserRoles,
    UserViewSet,
)

urlpatterns = [
    path("/login", LoginView.as_view(), name="user_login"),
    path("/user", FetchUser.as_view(), name="fetch_user"),
    path("/token/refresh", TokenRefreshView.as_view()),
    path("/password/change", ChangePassword.as_view(), name="password_change"),
    path(
        "password/admin_reset",
        AdminResetPassword.as_view(),
        name="admin_password_reset",
    ),
    path("/users/roles", UserRoles.as_view(), name="user_roles"),
    path("/users", UserViewSet.as_view(), name="users"),
    path(
        "/users/<uuid:user_id>", RetrieveUpdateDestroyUser.as_view(), name="user-detail"
    ),
]
