from datetime import datetime

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from school.models import School

from .models import Session

User = get_user_model()


class SessionAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        # Create a user
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )

        # Create a school
        self.school = School.objects.create(
            name="Test School",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        # Create a session
        self.session = Session.objects.create(
            name="Test Session",
            school=self.school,
            resumption_date=datetime.now().date(),
        )

    def test_list_sessions(self):
        url = reverse("list_create_session")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["data"]), 1
        )  # Assuming there is only one session in the database

    def test_create_session(self):
        url = reverse("list_create_session")
        self.client.force_authenticate(user=self.user)

        data = {
            "name": "New Session",
            "school": self.school.id,
            "resumption_date": datetime.now().date(),
            "start_date": "2022",
            "end_date": "2023",
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "success")
        self.assertEqual(response.data["message"], "Session created successfully.")
        self.assertEqual(response.data["data"]["name"], "2022 / 2023")

    def test_retrieve_session(self):
        url = reverse("retrieve_update_destroy_session", kwargs={"pk": self.session.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        self.assertEqual(response.data["message"], "Session fetched successfully.")
        self.assertEqual(response.data["data"]["name"], self.session.name)

    def test_update_session(self):
        url = reverse("retrieve_update_destroy_session", kwargs={"pk": self.session.id})
        self.client.force_authenticate(user=self.user)

        data = {"start_date": "2023", "end_date": "2024"}

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        self.assertEqual(response.data["message"], "Session updated successfully.")
        self.assertEqual(response.data["data"]["name"], "2023 / 2024")

    def test_delete_session(self):
        url = reverse("retrieve_update_destroy_session", kwargs={"pk": self.session.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data["status"], "success")
        self.assertEqual(response.data["message"], "Session updated successfully.")
        self.assertIsNone(response.data["data"])