"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from config.views import HealthCheck

urlpatterns = [
    path("admin", admin.site.urls),
    path("account", include("account.urls")),
    path("school", include("school.urls")),
    path("session", include("session.urls")),
    path("admission", include("admission.urls")),
    path("attendance", include("attendance.urls")),
    path("subject", include("subject.urls")),
    path("staff", include("staff.urls")),
    path("exam", include("exam.urls")),
    path("fees", include("fees.urls")),
    path("api/schema", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/docs-redoc", SpectacularRedocView.as_view(url_name="schema"), name="redoc"
    ),
    path("healthz", HealthCheck.as_view(), name="health_check"),
]
