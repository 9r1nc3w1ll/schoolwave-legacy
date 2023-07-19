from django.db import models
from django.db.models import Sum
from django.core.validators import MinValueValidator, MaxValueValidator
        

from config.models import BaseModel
from account.models import User
from school.models import Class, School
from session.models import Session, Term
from subject.models import Subject

PERCENTAGE_VALIDATOR = [MinValueValidator(0), MaxValueValidator(100)]

# TOTAL_SCORE: 100

class Grade(BaseModel):
    weight = models.IntegerField(validators=PERCENTAGE_VALIDATOR)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    term = models.ForeignKey(Term, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    


class GradingScheme(BaseModel):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    scheme = models.JSONField()



class Result(BaseModel):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    term = models.ForeignKey(Term, on_delete=models.CASCADE)
    total_score = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=255)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

    def compute_result(self):
        grading_scheme = GradingScheme.objects.get(school=self.student.school)

        grades = Grade.objects.filter(term=self.term, student=self.student, subject=self.subject)

        weighted_total = grades.aggregate(total=Sum('score'))['total']

        
