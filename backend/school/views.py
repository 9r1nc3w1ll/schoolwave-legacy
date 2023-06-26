import logging

from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from account.models import User
from account.serializers import OwnerSerializer, UserSerializer
from school.models import Class, School, ClassUser
from school.serializers import ClassSerializer, SchoolSerializer, ClassUserSerializer
from utils.permissions import IsSchoolOwner

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

        request.data.update({"owner": request.user.id})
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
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

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
            "message": "Classs fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)


# class RetrieveUpdateDestoryClass(RetrieveUpdateDestroyAPIView):
#     permission_classes = [IsAuthenticated, IsSchoolOwner]
#     queryset = Class.objects.all()
#     serializer_class = ClassSerializer

#     def get_queryset(self):
#         """
#         Modify in case user can have more than one school
#         """
#         school = School.objects.get(owner=self.request.user)

#         qs = self.queryset.filter(school=school)
#         return qs

#     def retrieve(self, request, *args, **kwargs):
#         instance = self.get_object()
#         serializer = self.get_serializer(instance)

#         # Get the number of students in the class
#         student_count = instance.student_set.count()

#         # Get the class teacher details
#         teacher = instance.class_teacher

#         resp = {
#             "status": "success",
#             "message": "Class fetched successfully.",
#             "data": {
#                 "class": serializer.data,
#                 "student_count": student_count,
#                 "class_teacher": {
#                     "id": teacher.id,
#                     "name": teacher.name,
#                     # Include other relevant details of the class teacher
#                 },
#             },
#         }
#         return Response(resp)

class RetrieveUpdateDestoryClass(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = Class.objects.all()
    serializer_class = ClassSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs

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


class ListCreateClassUser(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = ClassUser.objects.all()
    serializer_class = ClassUserSerializer

    def get_queryset(self):
        user = self.request.user

        qs = self.queryset.filter(user=user)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        headers = self.get_success_headers(serializer.data)
        resp = {
            "status": "success",
            "message": "Class user created successfully.",
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
            "message": "Class users fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)

class RetrieveUpdateDestoryClassUser(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = ClassUser.objects.all()
    serializer_class = ClassSerializer

    def get_queryset(self):
       user = self.request.user
       
       qs = self.queryset.filter(user=user)
       return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        resp = {
            "status": "success",
            "message": "Class user fetched successfully.",
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
            "message": "Class user updated successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        resp = {
            "status": "success",
            "message": "Class user destroyed successfully.",
            "data": None,
        }

        return Response(resp, status=status.HTTP_204_NO_CONTENT)