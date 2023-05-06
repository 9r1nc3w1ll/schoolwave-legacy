from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from school.models import School
from .models import Class
from django.contrib.auth.models import User


class ClassTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.school = School.objects.create(
            name='Test School',
            owner=self.user
        )
        self.class_obj = Class.objects.create(
            name='Test Class',
            school=self.school
        )

    def test_create_class(self):
        url = reverse('class-list-create')
        data = {
            'name': 'New Class',
            'school': self.school.id
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Class.objects.count(), 2)
        self.assertEqual(Class.objects.last().name, 'New Class')

    def test_list_classes(self):
        url = reverse('class-list-create')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['name'], 'Test Class')

    def test_retrieve_class(self):
        url = reverse('class-retrieve-update-destroy', args=[self.class_obj.id])
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['name'], 'Test Class')

    def test_update_class(self):
        url = reverse('class-retrieve-update-destroy', args=[self.class_obj.id])
        data = {
            'name': 'Updated Class',
            'school': self.school.id
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.put(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Class.objects.get(id=self.class_obj.id).name, 'Updated Class')

    def test_delete_class(self):
        url = reverse('class-retrieve-update-destroy', args=[self.class_obj.id])
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Class.objects.count(), 0)
