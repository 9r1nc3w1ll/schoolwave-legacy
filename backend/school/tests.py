from datetime import datetime

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from .models import School

User = get_user_model()


class SchoolAPITestCase(APITestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )

    def test_setup_status_no_user_no_school(self):
        url = reverse("setup_status")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_admin(self):
        url = reverse("register_admin")
        self.user.delete()
        
        data = {
            "username": "name1",
            "password": "password1123@!",
            "email": "sample@example.com",
            "first_name": "Name",
            "last_name": "Lastname",
            "role": "admin",
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_school(self):
        url = reverse("create_school")
        data = {
            "name": "Example School",
            "description": "This is an example school.",
            "owner": self.user.id,
            "date_of_establishment": "2022-01-01",
            "motto": "Learning is fun!",
            "website_url": "https://www.example.com",
            "tag": "example",
        }

        self.client.force_authenticate(user=self.user)

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
