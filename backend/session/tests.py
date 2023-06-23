from datetime import datetime

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from school.models import School

from .models import Session, Term

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
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        # Create a session
        self.session = Session.objects.create(
            school=self.school,
            resumption_date=datetime.now().date(),
            start_date="2040",
            end_date="2050"
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
            "school": self.school.id,
            "resumption_date": datetime.now().date(),
            "start_date": "2022",
            "end_date": "2023",
        }

        response = self.client.post(url, data)


        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "success")
        self.assertEqual(response.data["message"], "Session created successfully.")
        self.assertEqual(response.data["data"]["name"], "2022/2023")

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
        self.assertEqual(response.data["data"]["name"], "2023/2024")

    def test_delete_session(self):
        url = reverse("retrieve_update_destroy_session", kwargs={"pk": self.session.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data["status"], "success")
        self.assertEqual(response.data["message"], "Session updated successfully.")
        self.assertIsNone(response.data["data"])


class TermCRUDTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )

        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        self.session = Session.objects.create(
            school=self.school,
            resumption_date=datetime.now().date(),
            start_date="2040",
            end_date="2050"
        )

        self.term = Term.objects.create(
            name="1st Term",
            active="True",
            school=self.school,
            session=self.session,
            code="Term45"
        )

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

    def test_list_terms(self):
        url = reverse("list_create_term")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["data"]), 1
        )

    def test_create_term(self):
        url = reverse("list_create_term")
        self.client.force_authenticate(user=self.user)

        data = {
            "name":"2nd Term",
            "active":True,
            "school":self.school.id,
            "session":self.session.id,
            "code":"Term46"
        }

        response = self.client.post(url, data)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Term created successfully.")


    def test_retrieve_term(self):
        url = reverse("retrieve_update_destroy_term", kwargs={"pk":self.term.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Term retrieved successfully.")

    def test_update_term(self):
        url = reverse("retrieve_update_destroy_term", kwargs={"pk": self.term.id})
        self.client.force_authenticate(user=self.user)

        data = {
            "name": "3rd Term",
            "active": "True",
        }

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Term updated successfully.")
        self.assertEqual(response.data["data"]["name"], "3rd Term")

    def test_delete_term(self):
        url = reverse("retrieve_update_destroy_term", kwargs={"pk": self.term.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data["message"], "Term deleted successfully.")
