from django.urls import path

from .views import (
    ListCreateQuestion,
    RetrieveUpdateDestroyQuestion,
    ListCreateQuestionOption,
    RetrieveUpdateDestroyQuestionOption,
    ListCreateExam,
    RetrieveUpdateDestroyExam,
    ListCreateAnswer,
    RetrieveUpdateDestroyAnswer,
    BatchUploadAPI,
    GetSampleCSV
)

urlpatterns = [
    path(
        '/questions',
        ListCreateQuestion.as_view(),
        name='question_list_create',
    ),
    path(
        '/questions/<uuid:pk>',
        RetrieveUpdateDestroyQuestion.as_view(),
        name='question_retrieve_update_destroy',
    ),
    path(
        '/question-options',
        ListCreateQuestionOption.as_view(),
        name='question_option_list_create',
    ),
    path(
        '/question-options/<uuid:pk>',
        RetrieveUpdateDestroyQuestionOption.as_view(),
        name='question_option_retrieve_update_destroy',
    ),
    path(
        '/exams',
        ListCreateExam.as_view(),
        name='exam_list_create',
    ),
    path(
        '/exams/<uuid:pk>',
        RetrieveUpdateDestroyExam.as_view(),
        name='exam_retrieve_update_destroy',
    ),
    path(
        '/answers',
        ListCreateAnswer.as_view(),
        name='answer_list_create',
    ),
    path(
        '/answers/<uuid:pk>',
        RetrieveUpdateDestroyAnswer.as_view(),
        name='answer_retrieve_update_destroy',
    ),
    path('/batch_upload/', BatchUploadAPI.as_view(), name='exam_batch_upload'),
    path("/get_sample_csv", GetSampleCSV.as_view()),
]