from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .utils import schema_validator
from .models import GradingScheme, Grade, Result
from school.models import School
from .serializers import GradingSchemeSerializer, GradeSerializer, ResultSerializer
from utils.permissions import IsSchoolOwner



class GradingSchemeCreateView(generics.CreateAPIView):
    queryset = GradingScheme.objects.all()
    serializer_class = GradingSchemeSerializer
    permission_classes = [IsAuthenticated, IsSchoolOwner]

    def get_queryset(self):
        
        school = self.request.headers.get("x-client-id")

        qs = self.queryset.filter(school=school)
        return qs

    def create(self, request, *args, **kwargs):

        is_valid, message = schema_validator({"scheme" : request.data['scheme']})

        if not is_valid:
            return Response({"error" : message}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)


class GradeListCreateView(generics.ListCreateAPIView):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [IsAuthenticated,]

class GradeRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    permission_classes = [IsAuthenticated,]

class GetResultsByStudent(generics.ListCreateAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        student_id = self.kwargs.get("student_id")

        qs = self.queryset.filter(student_id=student_id)

        if qs.count() == 0:
            return Response(
                {"error" : "Results have not been computed for this student."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        return qs


class ComputeResults(generics.GenericAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated,]

    def get(self, request, *args, **kwargs):
        return

class GetResultsBySubject(generics.ListCreateAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated,]

    def get_queryset(self):
        subject_id = self.kwargs.get("subject_id")

        qs = self.queryset.filter(subject_id=subject_id)

        if qs.count() == 0:
            return Response(
                {"error" : "Results have not been computed for this subject"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        return qs

class ResultRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated,]