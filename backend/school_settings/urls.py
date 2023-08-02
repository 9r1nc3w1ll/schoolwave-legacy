from django.urls import path

from school_settings.views import SchoolSettingsCreateView

urlpatterns = [
    path("/settings", SchoolSettingsCreateView.as_view()),
    path("/settings/<uuid:school_id>", SchoolSettingsCreateView.as_view()),
]