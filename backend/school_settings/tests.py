from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from school.models import School
from .models import SchoolSettings, SchoolLogo, SchoolBrand
from django.contrib.auth import get_user_model
from datetime import datetime
from django.core.files import File

User = get_user_model()


class SchoolLogoTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )
        self.client.force_authenticate(user=self.user)

    def test_upload_logo(self):
        url = reverse('upload_school_logo')

        with open("school_settings/image.png", "rb") as image:
            response = self.client.post(url, 
                data={'school': self.school.id, 'file': image}, 
            )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_logo(self):
        with open("school_settings/image.png", "rb") as image:
            logo = SchoolLogo.objects.create(school_id=self.school.id, file=File(image))
        
        url = reverse('update_school_logo')
        data = {'school_id': self.school.id, 'logo_url': 'https://placehold.co/600x400.png'}

        response = self.client.patch(url, data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_logo_local(self):

        settings = SchoolSettings.objects.create(school=self.school, settings={'driver': 'local', 'base_path': 'logo', 'token': 'token'})
        logo = SchoolLogo.objects.create(school=self.school, file='path/to/test/image.jpg')
        url = reverse('get_school_logo')
        response = self.client.get(url, {'school_id': self.school.id})

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

        self.school_brand = SchoolBrand.objects.create(
            school=self.school,
            primary_color="#FF0000",
            secondary_color="#0000FF"
        )

    def test_list_school_brand(self):
        url = reverse("school_brand")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["data"]), 1)

    def test_create_school_brand(self):
        url = reverse("school_brand")
        self.client.force_authenticate(user=self.user)

        data = {
            "school": self.school.id,
            "primary_color": "#FF0000",
            "secondary_color": "#0000FF"
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "School Brand created successfully.")

    def test_retrieve_school_brand(self):
        url = reverse("school_brand_detail", kwargs={"pk": self.school_brand.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "School Brand retrieved successfully.")

    def test_update_school_brand(self):
        url = reverse("school_brand_detail", kwargs={"pk": self.school_brand.id})
        self.client.force_authenticate(user=self.user)

        data = {
            "primary_color": "#FF0032",
            "secondary_color": "#2200FF"
        }

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "School Brand updated successfully.")
        self.assertEqual(response.data["data"]["primary_color"], "#FF0032")

    def test_delete_school_brand(self):
        url = reverse("school_brand_detail", kwargs={"pk": self.school_brand.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data["message"], "School Brand deleted successfully.")

    
