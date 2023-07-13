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
        
        school = School.objects.get(owner=self.request.user)

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

class ResultListCreateView(generics.ListCreateAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated,]

class ResultRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    permission_classes = [IsAuthenticated,]

