import logging

from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from account.models import User
from account.serializers import OwnerSerializer, UserSerializer
from school.models import Class, School, ClassMember
from school.serializers import ClassSerializer, SchoolSerializer, ClassMemberSerializer, AdminDashboardSerializer
from utils.permissions import IsSchoolOwner, IsSuperAdmin
from django.db.models import Q
import uuid

from .serializers import SchoolLogoSerializer, SchoolSettingsSerializer, SchoolBrandSerializer
from utils.permissions import IsSchoolOwner
from .utils import attach_remote_image, validate
from rest_framework.parsers import MultiPartParser
from django.conf import settings

logger = logging.getLogger(__name__)


class SetupStatus(APIView):
    def get(self, request):
        step1 = User.objects.count() != 0
        step2 = School.objects.count() != 0
        return Response({"step1": step1, "step2": step2})


class CreateOwner(APIView):
    def post(self, request):
        if User.objects.count() != 0:
            return Response(
                {"message": "Owner already created."}, status=status.HTTP_409_CONFLICT
            )

        serializer = OwnerSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)

        serializer.save(is_active=True, role="admin")

        if (
            authenticate(
                request=request,
                username=serializer.validated_data.get("username"),  # type: ignore
                password=serializer.validated_data.get("password"),  # type: ignore
            )
            is None
        ):
            message = "user authentication failed"
            logger.warning(message)
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={message}
            )

        user: User = User.objects.get(username=serializer.data.get("username"))

        return Response(
            {
                "message": "Owner created successfully.",
                "data": UserSerializer(user).data,
            }
        )


class CreateSchool(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if School.objects.count() != 0:
            return Response(
                {"message": "School already created."}, status=status.HTTP_409_CONFLICT
            )

        request.POST._mutable = True
        request.data.update({"owner": request.user.id})
        request.POST._mutable = False

        serializer = SchoolSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)

        serializer.save()

        return Response(
            {
                "message": "School created successfully.",
                "school": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class ListCreateClass(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

    def get_queryset(self):
        school = self.request.headers.get("x-client-id")

        qs = self.queryset.filter(school=school)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        headers = self.get_success_headers(serializer.data)
        resp = {
            "status": "success",
            "message": "Class created successfully.",
            "data": serializer.data,
        }
        return Response(resp, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        resp = {
            "status": "success",
            "message": "Class fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)

class RetrieveUpdateDestoryClass(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

    def get_object(self):
        pk = self.kwargs.get("pk")
        try:
            if isinstance(pk, uuid.UUID):
                return Class.objects.get(
                    Q(id=pk) | Q(school_id=pk)
                )
            return super().get_object()
        except Class.DoesNotExist:
            return super().get_object()


    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        resp = {
            "status": "success",
            "message": "Class fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        resp = {
            "status": "success",
            "message": "Class updated successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        resp = {
            "status": "success",
            "message": "Class destroyed successfully.",
            "data": None,
        }

        return Response(resp, status=status.HTTP_204_NO_CONTENT)


class ListCreateClassMember(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ClassMember.objects.all()
    serializer_class = ClassMemberSerializer

    def get_queryset(self):
        school = self.request.headers.get("x-client-id")

        qs = self.queryset.filter(school=school)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        headers = self.get_success_headers(serializer.data)
        resp = {
            "status": "success",
            "message": "Class member created successfully.",
            "data": serializer.data,
        }
        return Response(resp, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        resp = {
            "status": "success",
            "message": "Class members fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)

class RetrieveUpdateDestoryClassMember(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ClassMember.objects.all()
    serializer_class = ClassMemberSerializer

   

    def retrieve(self, request, *args, **kwargs):
        pk = self.kwargs.get("pk")

        class_users = ClassMember.objects.filter(
                    Q(id=pk) | Q(class_id=pk) | Q(user=pk)
                )
        serializer = ClassMemberSerializer(class_users, many=True)

        resp = {
            "message": "Class members fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)


    def patch(self, request, *args, **kwargs):
        data = request.data
        class_user = self.get_object()

        serializer = ClassMemberSerializer(class_user, data=data, partial=True)
        if serializer.is_valid(): 
            class_user = serializer.save()
            data = ClassMemberSerializer(class_user).data

            resp = {
                "message": "Class member updated successfully.",
                "data": serializer.data,
            }
            return Response(resp)
        
        return Response({
            "message": "Class member not found.",
            "errors": serializer.errors
            })

    def destroy(self, request, *args, **kwargs):
        class_user = self.get_object()
        if class_user:
            class_user.delete()
            resp = {
                "message": "Class member deleted successfully.",
            }
            return Response(resp, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Class member not found."}, status=status.HTTP_404_NOT_FOUND)
        

class ListStudentClass(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ClassMember.objects.filter(user__role="student").all()
    serializer_class = ClassMemberSerializer

    def get_queryset(self):
        school = self.request.headers.get("x-client-id")

        qs = self.queryset.filter(school=school)
        return qs

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        resp = {
            "status": "success",
            "message": "Students Class fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)

class DashboardStatsAPIView(generics.GenericAPIView):
    queryset = School.objects.all()
    serializer_class = AdminDashboardSerializer
    permission_classes = [IsAuthenticated, IsSchoolOwner]

    def get(self, request, *args, **kwargs):
        school_id = self.request.headers.get("x-client-id")

        try:
            school = School.objects.get(id=school_id)
        except School.DoesNotExist:
            return Response({"message" : "School does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        data = AdminDashboardSerializer.get_dashboard_data(school.id)
        
        resp = {
            "message": "Dashboard Stats retrieved successfully.",
            "data": data,
        }
        return Response(resp)


class CreateSchoolAndOwner(APIView):
    def post(self, request, format=None):
        data = request.data.copy()
        
        if not request.user.is_superuser:
            return Response({"detail": "Only superusers can create schools."}, status=status.HTTP_403_FORBIDDEN)
        
        owner_data = data.copy()
        owner_data["school"] = None
        serializer_owner = UserSerializer(data=owner_data)
        
        if serializer_owner.is_valid():
            owner_instance = serializer_owner.save(is_active=True, role="admin")
            data["owner"] = owner_instance.id
            serializer_school = SchoolSerializer(data=data)
            if serializer_owner.is_valid() and serializer_school.is_valid():
                serializer = SchoolSerializer(data=data)
                if serializer.is_valid():
                    school = serializer.save()
                    message = "Owner and School created successfully."
                    data = SchoolSerializer(school).data
                    resp = {
                        "message": message,
                        "data": data,
                    }
                    return Response(resp, status=status.HTTP_201_CREATED)
                else:
                        resp = {
                            "message": "Validation Error.",
                            "errors": serializer.errors,
                        }
                        return Response(resp, status=status.HTTP_400_BAD_REQUEST)
            else:
                resp = {
                        "message": "Validation Error.",
                        "errors": serializer_school.errors,
                    }
                return Response(resp, status=status.HTTP_400_BAD_REQUEST)
        else:
            resp = {
                "message": "Validation Error.",
                "errors": serializer_owner.errors,
            }
            return Response(resp, status=status.HTTP_400_BAD_REQUEST)
            

class SchoolListAPIView(generics.GenericAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsSuperAdmin]

    def get(self, request):
        school_owners = User.objects.filter(school_owner__isnull=False)
        
        response_data = []

        for school_owner in school_owners:
            schools = School.objects.filter(owner=school_owner)

            school_owner_serializer = UserSerializer(school_owner)
            schools_serializer = SchoolSerializer(schools, many=True)

            owner = school_owner_serializer.data
            schools_data = schools_serializer.data  # Make sure schools_data is a list of dictionaries

            owner_data = {
                'owner_id': str(school_owner.id),
                'owner_username': school_owner.username,
                'owner_email': school_owner.email,
                'owner_fullname': school_owner.first_name + ' ' + school_owner.last_name,
            }

            for school in schools_data:
                formatted_school_data = {
                    'school_id': str(school['id']),
                    'created_at': str(school['created_at']),
                    'updated_at': str(school['updated_at']),
                    'deleted_at': str(school['deleted_at']),
                    'name': str(school['name']),
                    'description': str(school['description']),
                    'logo_file_name': school['logo_file_name'],
                    'date_of_establishment': str(school['date_of_establishment']),
                    'motto': school['motto'],
                    'tag': school['tag'],
                    'website_url': school['website_url'],
                }
                owner_and_schools_data = {**owner_data, **formatted_school_data}

            response_data.append(owner_and_schools_data)

        return Response({
            'message': 'School owner schools retrieved successfully',
            'data': response_data
        })

class StudentsWithNoClass(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsSchoolOwner]

    def get(self, request):
        school = self.request.headers.get("x-client-id")

        users_in_school = User.objects.filter(school=school).filter(role="student")

        class_members = ClassMember.objects.filter(user__in=users_in_school)

        users_with_no_class = users_in_school.exclude(id__in=class_members.values('user_id'))

        resp = {
            "message": "Students retrieved successfully.",
            "data": self.serializer_class(users_with_no_class, many=True).data,
        }
        return Response(resp)

class SchoolSettingsRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = School.objects.all()
    serializer_class = SchoolSettingsSerializer
    permission_classes = [IsAuthenticated, IsSchoolOwner]


    def get_object(self):
        school_id = self.request.headers.get("x-client-id")

        try:
            settings_qs = School.objects.get(id=school_id, owner=self.request.user)
            return settings_qs
        except School.DoesNotExist:
            return Response({"error" : "Access denied. School not found."}, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, *args, **kwargs):
        school = self.get_object()
        settings_qs = School.objects.filter(id=school.id)

        if not settings_qs.exists():
            return Response({"error" : "Settings for school have not been created."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(SchoolSettingsSerializer(settings_qs[0]).data) 

    def patch(self, request, *args, **kwargs):

        is_valid, message = validate({"settings" : request.data['settings']})

        if not is_valid:
            return Response({"error" : message}, status=status.HTTP_400_BAD_REQUEST)

        return super().update(request, *args, **kwargs)

class RetrieveUpdateSchoolLogo(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = School.objects.all()
    serializer_class = SchoolLogoSerializer
    
    def get_object(self):
        school_id = self.request.headers.get("x-client-id")

        try:
            school = School.objects.get(id=school_id, owner=self.request.user)
            return school
        except School.DoesNotExist:
            return Response({"error": "Access denied. School not found."}, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, *args, **kwargs):
        school = self.get_object()

        if not school.settings.get("logo"):
            return Response({"error": "Logo settings for school have not been created."}, status=status.HTTP_400_BAD_REQUEST)
        

        settings_dict = school.settings

        driver = settings_dict.get("storage_options", {}).get("driver", "")
        base_path = settings_dict.get("storage_options", {}).get("base_path", "")
        token = settings_dict.get("storage_options", {}).get("token", "")


        # logo instance
        try:
            logo = SchoolLogoSerializer(school).data['logo']
        except School.DoesNotExist:
            return Response({"error" : "School Logo does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        if driver == "local":
            file_url = f"{settings.MEDIA_URL}{logo['file']}"
        elif driver == "s3":
            s3_base_url = f"https://{settings.AWS_STORAGE_BUCKET_NAME}.s3.amazonaws.com"
            file_url = f"{s3_base_url}/{base_path}/{logo['file']}"
        else:
            return Response({"error": "Invalid storage driver"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "message": "School Logo retrieved successfully.",
            "logo_url": file_url}, status=status.HTTP_200_OK)
    

    def partial_update(self, request, *args, **kwargs):
        logo = self.get_object()

        
        
        data = request.data.get("logo", {})
        logo_url = data.get("logo_url", "")

        if not logo_url:
            return Response({"error" : "logo_url is required."}, status=status.HTTP_400_BAD_REQUEST)

        do_attach = attach_remote_image(logo, logo_url)

        if do_attach:
            return Response({"message": "Logo updated successfully"}, status=status.HTTP_200_OK)

        else:
            return Response({"error": "Failed to update logo"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RetrieveUpdateSchoolBrand(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = School.objects.all()
    serializer_class = SchoolBrandSerializer
    
    def get_object(self):
        school_id = self.request.headers.get("x-client-id")

        try:
            school = School.objects.get(id=school_id, owner=self.request.user)
            return school
        except School.DoesNotExist:
            return Response({"error": "Access denied. School not found."}, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, *args, **kwargs):
        school = self.get_object()

        if not school.settings.get("brand"):
            return Response({"error": "Brand settings for school have not been created."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            "message": "School Brand retrieved successfully.",
            "data": SchoolBrandSerializer(school).data
        })
     

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.get("brand", {})

        instance.settings["brand"] = data
        instance.save()

        return Response({
            "message": "School Brand updated successfully.",
            "data": SchoolBrandSerializer(instance).data
        })