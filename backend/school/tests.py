from datetime import datetime

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from school.models import Class, School, ClassMember

import json

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
        self.client.force_authenticate(user=self.user)
        data = {
            "name": "Example School",
            "description": "This is an example school.",
            "owner": self.user.id,
            "date_of_establishment": "2022-01-01",
            "motto": "Learning is fun!",
            "website_url": "https://www.example.com",
            "tag": "example",
        }      

        response = self.client.post(url, data=data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


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
            name="Test Class", school=self.school, description="Description", code="class12"
        )
        

    def test_create_class(self):
        url = reverse("list_create_class")
        self.client.force_authenticate(user=self.user)
        data = {
            "name": "New Class",
            "school": self.school.id,
            "description": "Description",
            "class_index": 1,
            "code": "class43"
        }
        
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Class created successfully.")


    def test_list_classes(self):
        url = reverse("list_create_class")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url, HTTP_X_CLIENT_ID=self.school.id)

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


class ClassMemberTests(APITestCase):
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
            name="Test Class", school=self.school, description="Description", code="class12"
        )

        self.teacher_user = User.objects.create_user(
            username="teacheruser", password="testpassword"
        )

        self.student_user = User.objects.create_user(
            username="studentuser", password="testpassword", first_name="firstname", last_name="lastname"
        )

        self.class_member_obj = ClassMember.objects.create(
            user= self.student_user,
            class_id= self.class_obj,
            role= "student",
            school=self.school
        )

    def test_create_class_member(self):
        url = reverse("list_create_class_member")
        self.client.force_authenticate(user=self.user)
        data = {
            "user": self.teacher_user.id,
            "class_id": self.class_obj.id,
            "role": "teacher",
            "school":self.school.id
        }
        
        response = self.client.post(url, data)

        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Class member created successfully.")


    def test_list_class_member(self):
        url = reverse("list_create_class_member")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url, HTTP_X_CLIENT_ID=self.school.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["data"]), 1
        )

    def test_retrieve_class_member(self):
        url = reverse("retrieve_update_destroy_class_member", kwargs={"pk":self.class_member_obj.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_class_member(self):
        url = reverse("retrieve_update_destroy_class_member", kwargs={"pk":self.class_member_obj.id})
        self.client.force_authenticate(user=self.user)
        data = {
                "user": self.student_user.id,
                "class_id": self.class_obj.id,
                "role": "student"
            }
        
        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Class member updated successfully.")

    def test_delete_class_member(self):
        url = reverse("retrieve_update_destroy_class_member", kwargs={"pk":self.class_member_obj.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_list_student_class(self):
        url = reverse("list_student_class")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

class CreateSchoolAndOwner(APITestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", password="testpassword", is_superuser=True
        )
        self.school = School.objects.create(
            name="Test School",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

    def test_create_school_and_owner(self):
        url = reverse("create_school_and_owner")
        self.client.force_authenticate(user=self.user)
        data = {
            "name": "Sample School",
            "date_of_establishment": "2023-09-01",
            "username": "testuser77",
            "password": "testpassword",
            "first_name": "first_name",
            "last_name":"last_name",
            "school":self.school.id
        }

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Owner and School created successfully.")

class SchoolLogoTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )
        self.client.force_authenticate(user=self.user)

    def test_retrieve_school_logo(self):
        url = reverse("school_logo_detail", kwargs={"school_id": self.school.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url, HTTP_X_CLIENT_ID=self.school.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "School Logo retrieved successfully.")
        
    def test_update_school_logo(self):
        url = reverse('school_logo_detail', kwargs={"school_id": self.school.id})
        data =  {
                    "logo":
                    {
                        "logo_url": "https://placehold.co/600x400.png",
                    },
                }

        response = self.client.patch(url, data=data, format='json', HTTP_X_CLIENT_ID=self.school.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class SchoolBrandTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )
        self.client.force_authenticate(user=self.user)

    def test_retrieve_school_brand(self):
        url = reverse("school_brand_detail", kwargs={"school_id": self.school.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url, HTTP_X_CLIENT_ID=self.school.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "School Brand retrieved successfully.")
        
    def test_update_school_brand(self):
        url = reverse("school_brand_detail", kwargs={"school_id": self.school.id})
        self.client.force_authenticate(user=self.user)

        data = {
            "id": str(self.school.id),
            "brand": {
                "primary_color": "#FF0032",
                "secondary_color": "#2200FF"
            }
        }

        school_id_str = str(self.school.id)

        data["school_id"] = school_id_str

        response = self.client.patch(url, json.dumps(data), content_type='application/json', HTTP_X_CLIENT_ID=self.school.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "School Brand updated successfully.")
        self.assertEqual(response.data["data"]["brand"]["primary_color"], "#FF0032")
        self.assertEqual(response.data["data"]["brand"]["secondary_color"], "#2200FF")