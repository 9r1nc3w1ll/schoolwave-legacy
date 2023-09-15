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
        class_id = self.kwargs.get("class_id")
        if class_id:
            return self.queryset.filter(id=class_id)
        else:
            return self.queryset.all()

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
        class_user_id = self.kwargs.get("class_user_id")
        if class_user_id:
            return self.queryset.filter(id=class_user_id)
        else:
            return self.queryset.all()

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
        return self.queryset.all()

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
        school_id = kwargs.get("school_id")

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
        
        serializer_owner = UserSerializer(data=data)
        if serializer_owner.is_valid():
            owner_instance = serializer_owner.save()
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

            owner_and_schools_data = {
                'message':'School owner schools retrieved successfully',
                'owner': school_owner_serializer.data,
                'schools': schools_serializer.data,
            }

            response_data.append(owner_and_schools_data)

        return Response(response_data)


class StudentsWithNoClass(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsSchoolOwner]

    def get(self, request):
        school = School.objects.get(owner=self.request.user)

        users_in_school = User.objects.filter(school=school).filter(role="student")

        class_members = ClassMember.objects.filter(user__in=users_in_school)

        users_with_no_class = users_in_school.exclude(id__in=class_members.values('user_id'))

        resp = {
            "message": "Students retrieved successfully.",
            "data": self.serializer_class(users_with_no_class, many=True).data,
        }
        return Response(resp)
