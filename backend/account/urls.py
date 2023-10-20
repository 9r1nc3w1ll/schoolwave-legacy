from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from account.views import (
    AdminResetPassword,
    ChangePassword,
    FetchUser,
    LoginView,
    RefreshAuthUser,
    RetrieveUpdateDestroyUser,
    UserRoles,
    UserViewSet,
    UserClass,
    RetrieveUpdateUserProfile,
    SuperAdminCreateView,
    RequestPasswordReset,
    VerifyToken,
    ResetPassword
)

urlpatterns = [
    path("/login", LoginView.as_view(), name="user_login"),
    path("/user", FetchUser.as_view(), name="fetch_user"),
    path("/refresh-auth-user", RefreshAuthUser.as_view(), name="refresh_auth_user"),
    path("/token/refresh", TokenRefreshView.as_view()),
    path("/password/change", ChangePassword.as_view(), name="password_change"),
    path(
        "/password/admin_reset",
        AdminResetPassword.as_view(),
        name="admin_password_reset",
    ),
    path("/password/request_reset", RequestPasswordReset.as_view(), name="request_password_reset"),
    path("/password/verify_token/<hashed_email>/<token>", VerifyToken.as_view(), name="verify_token"),
    path("/password/reset_password", ResetPassword.as_view(), name="reset_password"),
    path("/users/roles", UserRoles.as_view(), name="user_roles"),
    path("/users", UserViewSet.as_view(), name="users"),
    path(
        "/users/<uuid:user_id>", RetrieveUpdateDestroyUser.as_view(), name="user-detail"
    ),
    path(
        "/user/class", UserClass.as_view(), name="user-class"
    ),
        path(
        "/users/<uuid:user_id>", RetrieveUpdateUserProfile.as_view(), name="user-profile-detail"
    ),
    path(
        "/users/profile",
        RetrieveUpdateUserProfile.as_view(),
        name="user-profile",
    ),
    path('/create-super-admin', SuperAdminCreateView.as_view(), name='create_super_admin'),
]
