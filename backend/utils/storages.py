from django.conf import settings
import boto3


class S3Manager:
    def __init__(self):
        self.s3_client = boto3.client('s3', region_name=settings.AWS_S3_REGION_NAME,
                                      aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                      aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)

    def generate_presigned_url(self, bucket_name, object_name, object_type, expiration=3600):
        response = self.s3_client.generate_presigned_post(bucket_name, object_name,
                                                          Conditions=[{'Content-Type': object_type}], ExpiresIn=expiration)
        return response
