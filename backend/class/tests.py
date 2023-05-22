from datetime import datetime

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from school.models import School

from .models import Class

User = get_user_model()


class ClassTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", password="testpassword"
        )
        self.school = School.objects.create(
            name="Test School",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )
        self.class_obj = Class.objects.create(
            name="Test Class", school=self.school, description="Description"
        )

    def test_create_class(self):
        url = reverse("list_create_class")
        data = {
            "name": "New Class",
            "school": self.school.id,
            "description": "Description",
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Class.objects.count(), 2)
        self.assertEqual(Class.objects.last().name, "New Class")

    def test_list_classes(self):
        url = reverse("list_create_class")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["data"]), 1)
        self.assertEqual(response.data["data"][0]["name"], "Test Class")

    def test_retrieve_class(self):
        url = reverse("retrieve_update_destroy_class", args=[self.class_obj.id])
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["name"], "Test Class")

    def test_update_class(self):
        url = reverse("retrieve_update_destroy_class", args=[self.class_obj.id])
        data = {"name": "Updated Class", "school": self.school.id}
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Class.objects.get(id=self.class_obj.id).name, "Updated Class")

    def test_delete_class(self):
        url = reverse("retrieve_update_destroy_class", args=[self.class_obj.id])
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Class.objects.count(), 0)
