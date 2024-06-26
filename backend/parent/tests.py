from datetime import datetime

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from school.models import School

from parent.models import Family, FamilyRole

User = get_user_model()


class FamilyAPITestCase(APITestCase):
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

        self.parent_user = User.objects.create(
            username="parentuser", password="parentpassword", role="parent"
        )

        self.parent_user_1 = User.objects.create(
            username="parentuser1", password="parentpassword", role="parent"
        )

        self.family_role = FamilyRole.objects.create(
            name = "Guardian",
        )

        self.parent = Family.objects.create(
            member=self.parent_user,
            family_name="Surname",
            role=self.family_role
        )

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

    def test_list_parent(self):
        url = reverse("parent_list_create")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["data"]), 1
        )
    
    def test_batch_upload_parents(self):
        url = reverse("batch_upload_parents")
        self.client.force_authenticate(user=self.user)
        with open("parent/sample_upload.csv") as csv:
            response = self.client.post(
                path=url,
                data={"csv": csv},
            )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_parent(self):
        url = reverse("parent_list_create")
        self.client.force_authenticate(user=self.user)
        data = {
            "member": self.parent_user_1.id,
            "family_name": "lastname",
            "role": self.family_role.id,  # Pass the ID of the FamilyRole
        }
             
        response = self.client.post(url, data, HTTP_X_CLIENT_ID=self.school.id)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Parent created successfully.")

    def test_retrieve_parent(self):
        url = reverse("parent_retrieve_update_destroy", kwargs={"pk": self.parent.id})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Parent retrieved successfully.")

    def test_update_parent(self):
        url = reverse("parent_retrieve_update_destroy", kwargs={"pk": self.parent.id})
        data = {
            "member": self.parent_user.id,
            "family_name": "surname",
        }

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Parent updated successfully.")
        
    

    def test_delete_parent(self):
        url = reverse("parent_retrieve_update_destroy", kwargs={"pk": self.parent.id})

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class FamilyRoleAPITestCase(APITestCase):
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

        self.parent_user = User.objects.create(
            username="parentuser", password="parentpassword", role="parent"
        )

        self.family_role = FamilyRole.objects.create(
            name = "Guardian",
        )

        self.parent = Family.objects.create(
            member=self.parent_user,
            family_name="Surname",
            role=self.family_role
        )


        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.user.tokens['access']}")

    def test_list_parent_roles(self):
        url = reverse("parent_role_list_create")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["data"]), 1
        )

    def test_create_parent_roles(self):
        url = reverse("parent_role_list_create")
        self.client.force_authenticate(user=self.user)
        data = {
            "name" : "Parent",
        }
             
        response = self.client.post(url, data, HTTP_X_CLIENT_ID=self.school.id)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Parent role created successfully.")

    def test_retrieve_parent_role(self):
        url = reverse("parent_role_retrieve_update_destroy", kwargs={"name": self.family_role.name})

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Parent role retrieved successfully.")

    def test_update_parent_role(self):
        url = reverse("parent_role_retrieve_update_destroy", kwargs={"name": self.family_role.name})
        data = {
            "name" : "Parent",
        }

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Parent role updated successfully.")
        
    

    def test_delete_parent(self):
        url = reverse("parent_role_retrieve_update_destroy", kwargs={"name": self.family_role.name})

        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)