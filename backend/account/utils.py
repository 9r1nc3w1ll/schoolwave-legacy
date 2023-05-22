from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


def authenticate(username, password):
    return



def send_user_mail(email, body):
    try:
        # Twilio SendGrid API key
        SENDGRID_API_KEY = 'your_sendgrid_api_key'

        # SMTP server configuration
        SMTP_SERVER = 'smtp.sendgrid.net'
        SMTP_PORT = 587
        SMTP_USERNAME = 'apikey'
        SMTP_PASSWORD = SENDGRID_API_KEY

        # Create a SendGrid client
        client = SendGridAPIClient(api_key=SENDGRID_API_KEY)

        # Compose the email message
        message = Mail(
            from_email='sender@example.com',
            to_emails=email,
            subject='Email Subject',
            plain_text_content=body
        )

        # Send the email using SendGrid
        response = client.send(message)
        if response.status_code == 202:
            # Email sent successfully
            resp = {
                # "status": "success",
                # "message": "Email sent successfully",
                # "data": None
                }

            return Response(resp)
        else:
            # Failed to send email
            raise ValidationError("Failed to send email")
    except Exception as e:
        raise ValidationError(f'Error sending email: {str(e)}')


