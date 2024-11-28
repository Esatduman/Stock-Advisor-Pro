# from django.db import models

# # Create your models here.
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
import uuid


class AppUserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(email=self.normalize_email(email), username=username)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None):
        user = self.create_user(email, username, password)
        user.is_admin = True
        user.save(using=self._db)
        return user

class AppUser(AbstractBaseUser):

    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True) 

    balance = models.DecimalField(max_digits=10, decimal_places=2, default=10000.00)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    objects = AppUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin
    
class Stock(models.Model):
    user_email = models.EmailField()  # Store user's email directly here
    ticker = models.CharField(max_length=10)  # Stock ticker symbol (e.g., AAPL)
    quantity = models.PositiveIntegerField()  # Number of stocks owned
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Purchase price per stock

    def __str__(self):
        return f"{self.ticker} - {self.quantity} shares"

    class Meta:
        unique_together = ('user_email', 'ticker') 

class Watchlist(models.Model):
    user_email = models.EmailField()
    ticker = models.CharField(max_length=10)  # Stock ticker symbol (e.g., AAPL)
    
    def __str__(self):
        return f"{self.ticker}%)"

    class Meta:
        unique_together = ('user_email', 'ticker')