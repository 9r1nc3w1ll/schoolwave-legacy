from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import School, SchoolSettings, SchoolLogo
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
