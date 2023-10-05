from rest_framework import status
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    GenericAPIView
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Question, QuestionOption, Exam, Answer
from subject.models import Subject
from .serializers import (
    QuestionSerializer,
    BatchQuestionSerializer,
    QuestionOptionSerializer,
    ExamSerializer,
    AnswerSerializer,
)
from rest_framework.parsers import MultiPartParser

from django.db.models import Q
from django.http import HttpResponse
import uuid
import csv
import io
from school.models import School

class ListCreateQuestion(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

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
        question = serializer.save()
        return Response(
            {
                "message": "Question created successfully.",
                "data": QuestionSerializer(question).data,
            },
            status=status.HTTP_201_CREATED,
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                "message": "Questions fetched successfully.",
                "data": serializer.data,
            }
        )


class RetrieveUpdateDestroyQuestion(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs
    
    def get_object(self):
        question_id = self.kwargs.get("pk")
        try:
            question = self.queryset.get(id=question_id)
            return question
        except Question.DoesNotExist:
            return None

    def retrieve(self, request, *args, **kwargs):
        question = self.get_object()
        if not question:
            return Response({"message": "Question not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(question)
        return Response(
            {
                "message": "Question retrieved successfully.",
                "data": serializer.data,
            }
        )

    def update(self, request, *args, **kwargs):
        question = self.get_object()
        if not question:
            return Response({"message": "Question not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(question, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        question = serializer.save()
        return Response(
            {
                "message": "Question updated successfully.",
                "data": QuestionSerializer(question).data,
            }
        )

    def destroy(self, request, *args, **kwargs):
        question = self.get_object()
        if not question:
            return Response({"message": "Question not found."}, status=status.HTTP_404_NOT_FOUND)
        question.delete()
        return Response(
            {"message": "Question deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


class ListCreateQuestionOption(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = QuestionOption.objects.all()
    serializer_class = QuestionOptionSerializer

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
        question_option = serializer.save()
        return Response(
            {
                "message": "Question option created successfully.",
                "data": QuestionOptionSerializer(question_option).data,
            },
            status=status.HTTP_201_CREATED,
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                "message": "Question options fetched successfully.",
                "data": serializer.data,
            }
        )


class RetrieveUpdateDestroyQuestionOption(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = QuestionOption.objects.all()
    serializer_class = QuestionOptionSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs
    
    def get_object(self):
        pk = self.kwargs.get("pk")
        try:
            if isinstance(pk, uuid.UUID):
                return QuestionOption.objects.get(
                    Q(id=pk) | Q(question=pk)
                )
            else:
                return Response({
                    'message': 'Question option not found.'
                    })
        except QuestionOption.DoesNotExist:
            return Response({
                    'message': 'Question option not found.'
                    })

    def retrieve(self, request, *args, **kwargs):
        question_option = self.get_object()
        serializer = QuestionOptionSerializer(question_option)
        return Response(
            {
                "message": "Question option retrieved successfully.",
                "data": serializer.data,
            }
        )

    def patch(self, request, *args, **kwargs):
        data = request.data
        question_option = self.get_object()

        serializer = QuestionOptionSerializer(question_option, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        question_option = serializer.save()
        return Response(
            {
                "message": "Question option updated successfully.",
                "data": QuestionOptionSerializer(question_option).data,
            }
        )

    def destroy(self, request, *args, **kwargs):
        question_option = self.get_object()
        if not question_option:
            return Response(
                {"message": "Question option not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        question_option.delete()
        return Response(
            {"message": "Question option deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


class ListCreateExam(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

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
        exam = serializer.save()
        return Response(
            {
                "message": "Exam created successfully.",
                "data": ExamSerializer(exam).data,
            },
            status=status.HTTP_201_CREATED,
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                "message": "Exams fetched successfully.",
                "data": serializer.data,
            }
        )


class RetrieveUpdateDestroyExam(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs
    
    def get_object(self):
        exam_id = self.kwargs.get("pk")
        try:
            exam = self.queryset.get(id=exam_id)
            return exam
        except Exam.DoesNotExist:
            return None

    def retrieve(self, request, *args, **kwargs):
        exam = self.get_object()
        if not exam:
            return Response(
                {"message": "Exam not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(exam)
        return Response(
            {
                "message": "Exam retrieved successfully.",
                "data": serializer.data,
            }
        )

    def update(self, request, *args, **kwargs):
        exam = self.get_object()
        if not exam:
            return Response(
                {"message": "Exam not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(exam, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        exam = serializer.save()
        return Response(
            {
                "message": "Exam updated successfully.",
                "data": ExamSerializer(exam).data,
            }
        )

    def destroy(self, request, *args, **kwargs):
        exam = self.get_object()
        if not exam:
            return Response(
                {"message": "Exam not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        exam.delete()
        return Response(
            {"message": "Exam deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


class ListCreateAnswer(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

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
        answer = serializer.save()
        return Response(
            {
                "message": "Answer created successfully.",
                "data": AnswerSerializer(answer).data,
            },
            status=status.HTTP_201_CREATED,
        )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(
            {
                "message": "Answers fetched successfully.",
                "data": serializer.data,
            }
        )


class RetrieveUpdateDestroyAnswer(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs
    
    def get_object(self):
        answer_id = self.kwargs.get("pk")
        try:
            answer = self.queryset.get(id=answer_id)
            return answer
        except Answer.DoesNotExist:
            return None

    def retrieve(self, request, *args, **kwargs):
        answer = self.get_object()
        if not answer:
            return Response(
                {"message": "Answer not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(answer)
        return Response(
            {
                "message": "Answer retrieved successfully.",
                "data": serializer.data,
            }
        )

    def update(self, request, *args, **kwargs):
        answer = self.get_object()
        if not answer:
            return Response(
                {"message": "Answer not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(answer, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        answer = serializer.save()
        return Response(
            {
                "message": "Answer updated successfully.",
                "data": AnswerSerializer(answer).data,
            }
        )

    def destroy(self, request, *args, **kwargs):
        answer = self.get_object()
        if not answer:
            return Response(
                {"message": "Answer not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        answer.delete()
        return Response(
            {"message": "Answer deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )



class BatchUploadAPI(GenericAPIView):
    parser_classes = (MultiPartParser,)
    permission_classes = [IsAuthenticated]

    
    def post(self, request, *args, **kwargs):
        csv_file = request.FILES.get('csv')
        school_id = request.POST['school_id']

        if not csv_file.name.endswith('.csv'):
            return Response({'error': 'Invalid file format. Please upload a CSV file.'}, status=400)

        school = School.objects.get(id=school_id)
        questions = []
        data = csv_file.read().decode("utf-8")
        reader = csv.DictReader(io.StringIO(data))

        for row in reader:

            question_data = {
                'title': row['Question Title'],
                'subject_code': row['Subject Code'],
                'details': row['Details'],
                'type': row['Type'],
                'options': [
                    {'value': row[f'Option {i}'], 'right_option': row[f'Is Right Answer {i}']}
                    for i in range(1, 5)
                ]
            }
            questions.append(question_data)
        
        for question in questions:
            
            subject = Subject.objects.get(code=question["subject_code"])

            quest = Question.objects.create(
                title=question["title"],
                subject=subject,
                details=question["details"],
                school=school
            )

            for option in question["options"]:
                qs_option = QuestionOption.objects.create(
                    question=quest, value=option["value"],
                    right_option = option["right_option"].lower() == "true",
                    school=school
                )

        return Response({"message" : "Uploaded successfuly"}, status=status.HTTP_201_CREATED)

class GetSampleCSV(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        file = open("exam/question_options.csv", "r")

        response = HttpResponse(file, content_type="text/csv")
        response['Content-Disposition'] = 'attachment; filename=question_options.csv'

        return response