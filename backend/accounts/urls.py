from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import UserViewSet


router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('users/', include(router.urls)),
    path('users/<int:pk>/assign-role/', UserViewSet.as_view({'post': 'assign_role'})),
    path('users/<int:pk>/roles/', UserViewSet.as_view({'get': 'get_roles'})),
]


