from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six


class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        user_email = six.text_type(user.email)
        ts = six.text_type(timestamp)
        is_active = six.text_type(user.is_active)
        
        return f"{user_email}{ts}{is_active}"

account_activation_token = AccountActivationTokenGenerator()