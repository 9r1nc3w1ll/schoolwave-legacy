"""
REWRITE ALL TESTS HERE.
"""
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import datetime
from .models import School
from django.contrib.auth import get_user_model

User = get_user_model()

class SchoolAPITestCase(APITestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.school = School.objects.create(name='Test School', owner=self.user, date_of_establishment=datetime.now().date())


    def test_app_status_no_user_no_school(self):
        url = reverse('app_status')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_app_status_with_user(self):
        url = reverse('user_onboarding')
        data = {
                "username": "name1",
                "password": "password1123@!",
                "email": "sample@example.com",
                "first_name": "Name",
                "last_name": "Lastname"
            }
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_create_user_valid_credentials(self):
        url = reverse('user_onboarding')
        data = {
                "username": "name1",
                "password": "password1123@!",
                "email": "sample@example.com",
                "first_name": "Name",
                "last_name": "Lastname",
                "role": "student"
            }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_create_user_invalid_credentials(self):
        url = reverse('user_onboarding')
        data = {
            "username": "",
            "password": "",
            "email": "",
            "first_name": "",
            "last_name": ""
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_create_school_valid_data(self):
        
        url = reverse('school_onboarding')
        data = {
            "name": "Example School",
            "description": "This is an example school.",
            "owner": self.user.id,
            "date_of_establishment": "2022-01-01",
            "motto": "Learning is fun!",
            "website_url": "https://www.example.com",
            "tag": "example-school"
        }

        self.client.force_authenticate(user=self.user)

        response = self.client.post(url, data)
        
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_create_school_invalid_data(self):
        url = reverse('school_onboarding')
        data = {
                "name": "",
                "description": "",
                "owner": "",
                "date_of_establishment": "",
                "motto": "",
                "website_url": "",
                "tag": ""
            }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
