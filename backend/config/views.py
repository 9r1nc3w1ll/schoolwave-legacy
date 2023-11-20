from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from school.models import School, ClassMember
from staff.models import Staff
from subject.models import Subject
from account.models import User
from parent.models import Family

import boto3



class HealthCheck(APIView):
    def get(self, request):
        return Response(status=status.HTTP_200_OK)


class CheckEntities(APIView):

    def get(self, request, *args, **kwargs):
        schools = School.objects.all()
        staff = Staff.objects.all()
        subjects = Subject.objects.all()
        parents = Family.objects.all()


        data = {
            "schools" : True if len(schools) else False,
            "staff" : True if len(staff) else False,
            "subject"  : True if len(subjects) else False,
            "parents" : True if len(parents) else False
        }

        return Response(data)


class GetSignedURL(APIView):

    def get(self, request, *args, **kwargs):

        client = boto3.client('s3')
        response = client.generate_presigned_post(
            'get_object', 
            Params={'Bucket': bucket_name, 'Key': objectpath}, 
            HttpMethod="POST", 
            ExpiresIn=3600
        )