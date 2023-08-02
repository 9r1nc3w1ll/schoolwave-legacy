from rest_framework import generics, status
from rest_framework.response import Response
from .models import SchoolSettings
from rest_framework.permissions import IsAuthenticated
from .serializers import SchoolSettingsSerializer
from utils.permissions import IsSchoolOwner
from .utils import validate
from school.models import School

class SchoolSettingsCreateView(generics.CreateAPIView):
    queryset = SchoolSettings.objects.all()
    serializer_class = SchoolSettingsSerializer
    permission_classes = [IsAuthenticated, IsSchoolOwner]

    def get_queryset(self):
        
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs

    def create(self, request, *args, **kwargs):

        is_valid, message = validate({"settings" : request.data['settings']})

        if not is_valid:
            return Response({"error" : message}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)