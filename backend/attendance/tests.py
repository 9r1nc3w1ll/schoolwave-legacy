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

        # Create a user
        self.user = User.objects.create(
            username="testowner", password="testpassword", role="staff"
        )

        self.student = User.objects.create(
            username="teststudent", password="testpassword", role="student"
        )


        self.staff = User.objects.create(
            username="teststaff", password="testpassword", role="staff"
        )

        # Create a school
        self.school = School.objects.create(
            name="chrisland",
            owner=self.user,
            date_of_establishment=datetime.now().date(),
        )

        # Create a class
        self.class_obj = Class.objects.create(
            name="Test Class", school=self.school, description="Description"
        )

        self.attendance = StudentAttendance.objects.create(
            date="2023-05-30",
            student_id=self.student.id,
            class_id=self.class_obj,
            start_time="09:00:00",
            end_time="10:00:00",
            attendance_type="Daily",
            present=True,
            remark="Good",
            staff_id=self.staff.id
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.student.tokens['access']}")
    
    
    def test_list_attendance(self):
        url = reverse("student_attendance_list_create")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            len(response.data["data"]), 1
        )  # Assuming there is only one attendance in the database



    def test_create_student_attendance(self):
        url = reverse("student_attendance_list_create")
        self.client.force_authenticate(user=self.user)

        data = {
            "date": "2023-05-31",
            "student_id": self.student.id,  # Pass the ID of the student
            "class_id": self.class_obj.id,  # Pass the ID of the class
            "start_time": "10:00:00",
            "end_time": "11:00:00",
            "attendance_type": "Class",
            "present": True,
            "remark": "Excellent",
            "staff": self.staff.id,  # Pass the ID of the staff
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "success")
        self.assertEqual(response.data["message"], "Student attendance created successfully.")
        self.assertEqual(response.data["data"]["name"])


    # def test_retrieve_student_attendance(self):
    #     url = reverse("student_attendance_retrieve_update_destroy", kwargs={"pk":self.attendance.id})
    #     self.client.force_authenticate(user=self.user)
    #     response = self.client.get(url)

    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(response.data["status"], "success")
    #     self.assertEqual(response.data["message"], "Student Attendance fetched successfully.")
    #     self.assertEqual(response.data["data"], self.attendance)
        

    # def test_update_student_session(self):
    #     url = reverse("student_attendance_retrieve_update_destroy", kwargs={"pk": self.attendance.id})
    #     self.client.force_authenticate(user=self.user)

    #     data = {"start_time": "10:00:00", "end_time": "11:00:00"}

    #     response = self.client.patch(url, data)

    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(response.data["status"], "success")
    #     self.assertEqual(response.data["message"], "Student attendance updated successfully.")
    #     self.assertEqual(response.data["data"])


    # def test_delete_student_attendance(self):
    #     url = reverse("student_attendance_retrieve_update_destroy", kwargs={"pk": self.attendance.id})
    #     self.client.force_authenticate(user=self.user)
    #     response = self.client.delete(url)

    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    #     self.assertEqual(response.data["status"], "success")
    #     self.assertEqual(response.data["message"], "Student attendance updated successfully.")
    #     self.assertIsNone(response.data["data"])
