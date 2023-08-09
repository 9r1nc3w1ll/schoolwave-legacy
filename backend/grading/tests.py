from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .models import GradingScheme, Grade, Result

from school.models import School, Class
from subject.models import Subject

from session.models import Session, Term

from datetime import datetime

from django.contrib.auth import get_user_model

User = get_user_model()

class GradingSchemeAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create_user(
            username="testuser", password="testpassword", role="owner"
        )

        self.student = User.objects.create_user(
            username="teststudent", password="testpassword", role="student"
        )

        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

    def test_create_grading_scheme(self):
        url = reverse('grading-scheme-create')
        data = {
            'school': self.school.id,
            'scheme': {
                "A": {
                    "min": 70,
                    "max": 100
                },
                "B": {
                    "min": 60,
                    "max": 69,
                },
                "C": {
                    "min": 50,
                    "max": 59,
                },
                "D": {
                    "min": 40,
                    "max": 49,
                },
                "E": {
                    "min": 30,
                    "max": 39,
                },
                "F": {
                    "min": 0,
                    "max": 29,
                },
            
            }
        }

        self.client.force_authenticate(user=self.user)

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        

    def test_create_grading_scheme_with_invalid_schema(self):
        url = reverse('grading-scheme-create')
        data = {
            'school': 1,
            'scheme': {
                "A": {
                    "min": 70,
                    "max": 65
                },
                "B": {
                    "min": 60,
                    "max": 65,
                }
            }
        }
        self.client.force_authenticate(user=self.user)
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        

class GradeAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpassword", role="owner"
        )

        self.student = User.objects.create_user(
            username="teststudent", password="testpassword", role="student"
        )

        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        self.class_obj = Class.objects.create(
            name="Test Class", school=self.school, description="Description", code="Prim"
        )

        self.session = Session.objects.create(
            school=self.school,
            resumption_date=datetime.now().date(),
            start_date="2040",
            end_date="2050"
        )

        self.term = Term.objects.create(
            name="1st Term", active="True", school=self.school, session=self.session, code="Term45"
        )

        self.subject = Subject.objects.create(
            name="Math",
            description="Mathematics subject",
            term=self.term,
            class_id=self.class_obj,
            code="Sub98",
            school=self.school
        )

        self.grade = Grade.objects.create(weight=30, student=self.student, subject=self.subject, term=self.term, score=30, school=self.school)

    def test_get_grade(self):
        url = reverse('grade-detail', args=[self.grade.id])
        self.client.force_authenticate(user=self.user)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        

    def test_create_grade(self):
        url = reverse('grade-list')
        data = {
            'weight': 40,
            'student': self.student.id,
            'subject': self.subject.id,
            'term': self.term.id,
            'score' : 30,
            "school": self.school.id
        }
        self.client.force_authenticate(user=self.user)

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_update_grade(self):
        url = reverse('grade-detail', args=[self.grade.id])
        data = {
            'weight': 50,
            'student': self.student.id,
            'subject': self.subject.id,
            'term': self.term.id
        }

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_grade(self):
        url = reverse('grade-detail', args=[self.grade.id])

        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

