from datetime import datetime

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from school.models import School

from staff.models import Staff, StaffRole

User = get_user_model()


class StaffAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create(
            username="testowner", password="testpassword"
        )

        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        self.staff_user = User.objects.create(
            username="staffuser", password="staffpassword", role="staff"
        )

        self.staff_user_1 = User.objects.create(
            username="staffuser1", password="staffpassword", role="staff"
        )

        self.staff_role1 = StaffRole.objects.create(
            name = "Class Teacher",
            description = "Primary 4 class teacher"
        )

        self.staff_role2 = StaffRole.objects.create(
            name = "Lesson Teacher",
            description = "Primary 5 lesson teacher"
        )

        self.staff = Staff.objects.create(
            user=self.staff_user,
            title="Staff Title",
        )

        role1 = StaffRole.objects.get(name="Class Teacher")
        role2 = StaffRole.objects.get(name="Lesson Teacher")

        self.staff.roles.set([role1, role2])

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

    def test_list_staff(self):
        url = reverse("staff_list_create")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["data"]), 1
        )

    def test_create_staff(self):
        url = reverse("staff_list_create")
        self.client.force_authenticate(user=self.user)
        data = {
            "username": "newuser", 
            "password": "newpassword", 
            "first_name":"user_firstname", 
            "last_name":"User_last_name",
            "title": "Staff Title",
            "roles": [self.staff_role2.id],
        }
             
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Staff created successfully.")


    def test_retrieve_staff(self):
        url = reverse("staff_retrieve_update_destroy", kwargs={"pk": self.staff.id})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Staff retrieved successfully.")

    def test_update_staff(self):
        url = reverse("staff_retrieve_update_destroy", kwargs={"pk": self.staff.id})
        data = {
            "user": self.staff_user.id,
            "title": "Updated Staff Title",
        }

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Staff updated successfully.")
        
    

    def test_delete_staff(self):
        url = reverse("staff_retrieve_update_destroy", kwargs={"pk": self.staff.id})

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class StaffRoleAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create(
            username="testowner", password="testpassword"
        )

        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        self.staff_user = User.objects.create(
            username="staffuser", password="staffpassword", role="staff"
        )

        self.staff_role1 = StaffRole.objects.create(
            name = "Class Teacher",
            description = "Primary 4 class teacher"
        )

        self.staff_role2 = StaffRole.objects.create(
            name = "Lesson Teacher",
            description = "Primary 5 lesson teacher"
        )

        role1 = StaffRole.objects.get(name="Class Teacher")
        role2 = StaffRole.objects.get(name="Lesson Teacher")

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

    def test_list_staff_role(self):
        url = reverse("staff_role_list_create")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["data"]), 2
        )

    def test_create_staff_role(self):
        url = reverse("staff_role_list_create")
        self.client.force_authenticate(user=self.user)
        data = {
            "name" : "Nursery Teacher",
            "description" : "Nusery lesson teacher"
        }
             
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Staff role assignment created successfully.")


    def test_retrieve_staff_role(self):
        url = reverse("staff_role_retrieve_update_destroy", kwargs={"name": self.staff_role2.name})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Staff role retrieved successfully.")

    def test_update_staff_role(self):
        url = reverse("staff_role_retrieve_update_destroy", kwargs={"name": self.staff_role2.name})
        data = {
            "name" : "Principal",
            "description" : "Head Teacher"
        }

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Staff role updated successfully.")
        
    

    def test_delete_staff(self):
        url = reverse("staff_role_retrieve_update_destroy", kwargs={"name": self.staff_role2.name})

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
