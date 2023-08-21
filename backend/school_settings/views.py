from rest_framework import generics, status
from rest_framework.response import Response
from .models import SchoolLogo, SchoolSettings, SchoolBrand
from rest_framework.permissions import IsAuthenticated
from .serializers import SchoolLogoSerializer, SchoolSettingsSerializer, SchoolBrandSerializer
from utils.permissions import IsSchoolOwner
from .utils import attach_remote_image, validate
from rest_framework.parsers import MultiPartParser
from school.models import School
from django.conf import settings

from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

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


class FetchSettings(generics.GenericAPIView):
    queryset = SchoolSettings.objects.all()
    serializer_class = SchoolSettingsSerializer
    permission_classes = [IsAuthenticated, IsSchoolOwner]

    
    def get(self, request, *args, **kwargs):
        school_id = kwargs.get("school_id", "")

        settings_qs = SchoolSettings.objects.filter(school_id=school_id)

        if not settings_qs.exists():
            return Response({"error" : "Settings for school have not been created."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(SchoolSettingsSerializer(settings_qs[0]).data)


class UploadSchoolLogo(generics.CreateAPIView):
    queryset = SchoolLogo.objects.all()
    serializer_class = SchoolLogoSerializer
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    parser_classes = [MultiPartParser]

    def get_queryset(self):
        
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs


class UpdateLogo(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]

    def patch(self, request, *args, **kwargs):
        data = request.data

        school_id = data.get("school_id", "")
        logo_url = data.get("logo_url", "")

        if not logo_url:
            return Response({"error" : "logo_url is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not school_id:
            return Response({"error" : "school_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            logo = SchoolLogo.objects.get(school_id=school_id)
        except SchoolLogo.DoesNotExist:
            return Response({"error" : "Invalid school_id"}, status=status.HTTP_400_BAD_REQUEST)
        
        do_attach = attach_remote_image(logo, logo_url)

        if do_attach:
            return Response({"message": "Logo updated successfully"}, status=status.HTTP_200_OK)




class GetLogo(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        school_id = request.GET.get("school_id", "")

        if not school_id:
            return Response({"error" : "Query string school_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        school = School.objects.filter(owner=self.request.user, id=school_id)
        
        if not school.exists():
            return Response({"error" : "Invalid school_id"}, status=status.HTTP_400_BAD_REQUEST)
        
        settings_qs = SchoolSettings.objects.filter(school_id=school_id)

        if not settings_qs.exists():
            return Response({"error" : "Settings for school have not been created."}, status=status.HTTP_400_BAD_REQUEST)

        settings_obj = settings_qs[0]

        settings_dict = dict(settings_obj.settings)

        driver = settings_dict.get("driver", "")
        base_path = settings_dict.get("base_path", "")
        token = settings_dict.get("token", "")

        # logo instance
        try:
            logo = SchoolLogo.objects.get(school_id=school_id)
        except SchoolLogo.DoesNotExist:
            return Response({"error" : "Invalid school_id"}, status=status.HTTP_400_BAD_REQUEST)
        
        if driver == "local":
            file_url = f"{settings.MEDIA_URL}/{logo.file.url}"
        elif driver == "s3":
            s3_base_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com"
            file_url = f"{s3_base_url}/{base_path}/{logo.file.name}"
        else:
            return Response({"error": "Invalid storage driver"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"logo_url": file_url}, status=status.HTTP_200_OK)
    
class ListCreateSchoolBrand(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = SchoolBrand.objects.all()
    serializer_class = SchoolBrandSerializer

    def get_queryset(self):
        schoolbrand_id = self.kwargs.get("schoolbrand_id")
        if schoolbrand_id:
            return self.queryset.filter(id=schoolbrand_id)
        else:
            return self.queryset.all()

    def create(self, request, *args, **kwargs):
        serializer = SchoolBrandSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        school_brand = serializer.save()
        return Response(
            {
                "message": "School Brand created successfully.",
                "data": SchoolBrandSerializer(school_brand).data,
            },
            status=status.HTTP_201_CREATED,
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                "message": "School Brand fetched successfully.",
                "data": serializer.data,
            }
        )


class RetrieveUpdateDeleteSchoolBrand(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = SchoolBrand.objects.all()
    serializer_class = SchoolBrandSerializer

    def get_object(self):
        schoolbrand_id = self.kwargs.get("pk")
        try:
            schoolbrand_id = self.queryset.get(id=schoolbrand_id)
            return schoolbrand_id
        except SchoolBrand.DoesNotExist:
            return None

    def retrieve(self, request, *args, **kwargs):
        school_brand= self.get_object()
        serializer = SchoolBrandSerializer(school_brand)
        return Response(
            {
                "message": "School Brand retrieved successfully.",
                "data": serializer.data,
            }
        )

    def patch(self, request, *args, **kwargs):
        data = request.data
        school_brand= self.get_object()

        serializer = SchoolBrandSerializer(school_brand, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        school_brand= serializer.save()
        return Response(
            {
                "message": "School Brand updated successfully.",
                "data": SchoolBrandSerializer(school_brand).data,
            }
        )

    def destroy(self, request, *args, **kwargs):
        school_brand= self.get_object()
        if not school_brand:
            return Response(
                {"message": "School Brand not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        school_brand.delete()
        return Response(
            {"message": "School Brand deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )