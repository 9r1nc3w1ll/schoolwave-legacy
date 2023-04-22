from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from .forms import UserLoginForm

app_name = 'accounts'

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.LoginView, name='login'),  
    path('logout/', views.logout_view, name='logout'),
    # path('password-reset/', auth_views.PasswordResetView.as_view(template_name='users/password_reset.html'),
    #      name='password-reset'),
    # path('password-reset/done', auth_views.PasswordResetDoneView.as_view(
    #     template_name='users/password_reset_done.html'),
    #     name='password-reset-done'),
    # path('password-reset/confirm/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(
    #     template_name='users/password_reset_confirm.html'),
    #     name='password-reset-done'),
]
