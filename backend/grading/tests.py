from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .models import GradingScheme, Grade, Result
from .serializers import GradeSerializer, ResultSerializer

from school.models import School, Class
from subject.models import Subject, SubjectSelection, SubjectStaffAssignment

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

        self.grade = Grade.objects.create(weight=30, student_id=self.student, subject_id=1, term_id=1)

    def test_get_grade(self):
        url = reverse('grade-detail', args=[self.grade.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, GradeSerializer(self.grade).data)

    def test_create_grade(self):
        url = reverse('grade-list')
        data = {
            'weight': 40,
            'student': 1,
            'subject': 2,
            'term': 1
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Grade.objects.count(), 2)
        self.assertEqual(Grade.objects.last().weight, 40)

    def test_update_grade(self):
        url = reverse('grade-detail', args=[self.grade.id])
        data = {
            'weight': 50,
            'student': 1,
            'subject': 1,
            'term': 1
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Grade.objects.get(id=self.grade.id).weight, 50)

    def test_delete_grade(self):
        url = reverse('grade-detail', args=[self.grade.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Grade.objects.count(), 0)

class ResultAPITest(APITestCase):
    def setUp(self):
        self.result = Result.objects.create(student_id=1, term_id=1, total_score=90, grade='A')

    def test_get_result(self):
        url = reverse('result-detail', args=[self.result.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, ResultSerializer(self.result).data)

    def test_create_result(self):
        url = reverse('result-list')
        data = {
            'student': 1,
            'term': 2,
            'total_score': 80,
            'grade': 'B'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Result.objects.count(), 2)
        self.assertEqual(Result.objects.last().total_score, 80)

    def test_update_result(self):
        url = reverse('result-detail', args=[self.result.id])
        data = {
            'student': 1,
            'term': 1,
            'total_score': 95,
            'grade': 'A+'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Result.objects.get(id=self.result.id).total_score, 95)

    def test_delete_result(self):
        url = reverse('result-detail', args=[self.result.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Result.objects.count(), 0)
