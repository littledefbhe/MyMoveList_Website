from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo, Length, ValidationError
from .models import User

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=4, max=20)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    def validate_password_complexity(form, field):
        password = field.data
        if len(password) < 8:
            raise ValidationError('Password must be at least 8 characters long')
        if not any(c.isupper() for c in password):
            raise ValidationError('Password must contain at least one uppercase letter')
        if not any(c.islower() for c in password):
            raise ValidationError('Password must contain at least one lowercase letter')
        if not any(c.isdigit() for c in password):
            raise ValidationError('Password must contain at least one number')
        if not any(not c.isalnum() for c in password):
            raise ValidationError('Password must contain at least one special character')

    password = PasswordField('Password', validators=[
        DataRequired(),
        validate_password_complexity
    ])
    confirm_password = PasswordField('Confirm Password', validators=[
        DataRequired(),
        EqualTo('password', message='Passwords must match')
    ])
    submit = SubmitField('Sign Up')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('That username is already taken. Please choose a different one.')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('That email is already registered. Please use a different one.')
