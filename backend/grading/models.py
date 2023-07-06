from django.db import models

from django.core.validators import MinValueValidator, MaxValueValidator
        

from config.models import BaseModel
from account.models import User
from school.models import Class, School
from session.models import Session, Term
from subject.models import Subject

PERCENTAGE_VALIDATOR = [MinValueValidator(0), MaxValueValidator(100)]

class Grade(BaseModel):
    weight = models.IntegerField(validators=PERCENTAGE_VALIDATOR)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    term = models.ForeignKey(Term, on_delete=models.CASCADE)


class Result(BaseModel):
    grades = models.ManyToManyField(Grade)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    term = models.ForeignKey(Term, on_delete=models.CASCADE)