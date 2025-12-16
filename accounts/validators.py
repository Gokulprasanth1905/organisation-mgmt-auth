import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class CustomPasswordValidator:
    def validate(self, password, user=None):

        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                _("Password must contain at least 1 uppercase letter."),
                code='password_no_upper'
            )

        if not re.search(r'[a-z]', password):
            raise ValidationError(
                _("Password must contain at least 1 lowercase letter."),
                code='password_no_lower'
            )

        if not re.search(r'[0-9]', password):
            raise ValidationError(
                _("Password must contain at least 1 digit."),
                code='password_no_digit'
            )

        if not re.search(r'[^\w]', password):
            raise ValidationError(
                _("Password must contain at least 1 special character."),
                code='password_no_special'
            )

    def get_help_text(self):
        return _(
            "Your password must contain at least 1 uppercase letter, "
            "1 lowercase letter, 1 number, and 1 special character."
        )
