from rest_framework import status
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Question, QuestionOption, Exam, Answer
from .serializers import (
    QuestionSerializer,
    QuestionOptionSerializer,
    ExamSerializer,
    AnswerSerializer,
)


class ListCreateQuestion(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def get_queryset(self):
        return self.queryset.all()

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
        return self.queryset.all()

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

    def get_object(self):
        question_option_id = self.kwargs.get("pk")
        try:
            question_option = self.queryset.get(id=question_option_id)
            return question_option
        except QuestionOption.DoesNotExist:
            return None

    def retrieve(self, request, *args, **kwargs):
        question_option = self.get_object()
        if not question_option:
            return Response(
                {"message": "Question option not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(question_option)
        return Response(
            {
                "message": "Question option retrieved successfully.",
                "data": serializer.data,
            }
        )

    def update(self, request, *args, **kwargs):
        question_option = self.get_object()
        if not question_option:
            return Response(
                {"message": "Question option not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(question_option, data=request.data, partial=True)
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
        return self.queryset.all()

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
        return self.queryset.all()

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