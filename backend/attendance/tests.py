from datetime import datetime

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from attendance.models import StudentAttendance

from school.models import Class, School

User = get_user_model()

class StudentAttendanceAPITestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = User.objects.create(
            username="testowner", password="testpassword", role="staff"
        )

        self.student_obj = User.objects.create(
            username="teststudent", password="testpassword", role="student"
        )

        self.staff_obj = User.objects.create(
            username="teststaff", password="testpassword", role="staff"
        )

        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        self.class_obj = Class.objects.create(
            name="Test Class", school=self.school, description="Description"
        )

        self.attendance = StudentAttendance.objects.create(
            date="2023-05-30",
            student_id=self.student_obj.id,
            class_id=self.class_obj,
            start_time="09:00:00",
            end_time="10:00:00",
            attendance_type="Daily",
            present=True,
            remark="Good",
            staff_id=self.staff_obj.id
        )

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.student_obj.tokens['access']}")
    
    
    def test_list_attendance(self):
        url = reverse("student_attendance_list_create")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["data"]), 1
        )

    def test_create_student_attendance(self):
        url = reverse("student_attendance_list_create")
        self.client.force_authenticate(user=self.user)

        data = {

            "date": "2023-05-31",
            "start_time": "10:00:00",
            "end_time": "11:00:00",
            "attendance_type": "Class",
            "present": "False",
            "remark": "Poor",
            "student" : self.student_obj.id,
            "class_id" : self.class_obj.id,
            "staff" : self.staff_obj.id

        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"], "Student attendance created successfully.")




    def test_retrieve_student_attendance(self):
        url = reverse("student_attendance_retrieve_update_destroy", kwargs={"pk":self.attendance.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Student attendance retrieved successfully.")
        

    def test_update_student_session(self):
        url = reverse("student_attendance_retrieve_update_destroy", kwargs={"pk": self.attendance.id})
        self.client.force_authenticate(user=self.user)

        data = {"start_time": "10:00:00", "end_time": "11:00:00"}

        response = self.client.patch(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Student attendance updated successfully.")
        self.assertEqual(response.data["data"]["start_time"], "10:00:00")


    def test_delete_student_attendance(self):
        url = reverse("student_attendance_retrieve_update_destroy", kwargs={"pk": self.attendance.id})
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data["message"], "Student attendance deleted successfully.")
