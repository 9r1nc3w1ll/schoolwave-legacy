from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from account.models import User
from staff.models import Staff

User = get_user_model()


class StaffAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.admin = User.objects.create(
            username="admin", password="adminpassword", role="admin"
        )
        self.staff_user = User.objects.create(
            username="staffuser", password="staffpassword", role="staff"
        )

        self.staff = Staff.objects.create(
            user=self.staff_user,
            title="Staff Title",
            roles=["Teacher", "Principal"],
            custom_role_id=self.staff_user.id,
        )

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.admin.tokens['access']}")

    def test_create_staff(self):
        url = reverse("staff_list")
        data = {
            "user": self.staff_user.id,
            "title": "Staff Title",
            "roles": ["Teacher", "Principal"],
            "custom_role_id": self.staff_user.id,
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["user"], self.staff_user.id)
        self.assertEqual(response.data["title"], "Staff Title")
        self.assertEqual(response.data["roles"], ["Teacher", "Principal"])
        self.assertEqual(response.data["custom_role_id"], self.staff_user.id)

    def test_retrieve_staff(self):
        url = reverse("staff_detail", kwargs={"pk": self.staff.id})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"], self.staff.user.id)
        self.assertEqual(response.data["title"], "Staff Title")
        self.assertEqual(response.data["roles"], ["Teacher", "Principal"])
        self.assertEqual(response.data["custom_role_id"], self.staff.user.id)

    def test_update_staff(self):
        url = reverse("staff_detail", kwargs={"pk": self.staff.id})
        data = {
            "user": self.staff_user.id,
            "title": "Updated Staff Title",
            "roles": ["Teacher", "Principal", "Counselor"],
            "custom_role_id": self.staff_user.id,
        }

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"], self.staff_user.id)
        self.assertEqual(response.data["title"], "Updated Staff Title")
        self.assertEqual(response.data["roles"], ["Teacher", "Principal", "Counselor"])
        self.assertEqual(response.data["custom_role_id"], self.staff_user.id)

    def test_delete_staff(self):
        url = reverse("staff_detail", kwargs={"pk": self.staff.id})

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
