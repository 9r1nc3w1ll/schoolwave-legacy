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
                '0:60': 'C',
                '61:80': 'B',
                '81:100': 'A'
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
                '0-60': 'C',  # Invalid range format
                '61:80': 'B',
                '81:100': 'A'
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
            code="Sub98"
        )

        self.grade = Grade.objects.create(weight=30, student=self.student, subject=self.subject, term=self.term)

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
            'term': self.term.id
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
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_grade(self):
        url = reverse('grade-detail', args=[self.grade.id])

        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class ResultAPITest(APITestCase):
    def setUp(self):
        self.result = Result.objects.create(student_id=1, term_id=1, total_score=90, grade='A')

    def test_get_result(self):
        url = reverse('result-detail', args=[self.result.id])

        self.client.force_authenticate(user=self.user)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_result(self):
        url = reverse('result-list')
        data = {
            'student': self.student.id,
            'term': self.term.id,
            'total_score': 80,
            'grade': 'B'
        }

        self.client.force_authenticate(user=self.user)

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_result(self):
        url = reverse('result-detail', args=[self.result.id])
        data = {
            'student': self.student.id,
            'term': self.term.id,
            'total_score': 95,
            'grade': 'A+'
        }

        self.client.force_authenticate(user=self.user)

        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_result(self):
        url = reverse('result-detail', args=[self.result.id])

        self.client.force_authenticate(user=self.user)
        
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
