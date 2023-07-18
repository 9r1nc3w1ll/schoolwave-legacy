from django.db import models

from config.models import BaseModel
from subject.models import Subject
from school.models import Class

from ckeditor.fields import RichTextField

class Question(BaseModel):
    class Meta:
        db_table = "questions"
    title = models.CharField(max_length=100)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    details = RichTextField()
    QUESTION_TYPE_CHOICES = [
        ('quiz', 'Quiz'),
        ('free form', 'Free Form')
    ]
    type = models.CharField(max_length=20, choices=QUESTION_TYPE_CHOICES)

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)


class QuestionOption(BaseModel):
    class Meta:
        db_table = "question_options"
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    value = models.CharField(max_length=100)
    right_option = models.BooleanField()

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)


class Exam(BaseModel):
    class Meta:
        db_table = "exams"
    name = models.CharField(max_length=100)
    description = models.TextField()
    questions = models.ManyToManyField(Question, blank=True)
    class_name = models.ForeignKey(Class, on_delete=models.CASCADE)
    start_date = models.DateField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)


class Answer(BaseModel):
    class Meta:
        db_table = "answers"
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer_option = models.ForeignKey(QuestionOption, on_delete=models.CASCADE, null=True, blank=True)
    answer_value = models.TextField(null=True, blank=True)
    correct_answer = models.BooleanField()

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)