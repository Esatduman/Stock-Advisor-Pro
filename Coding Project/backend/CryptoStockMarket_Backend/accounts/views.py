from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from .validations import custom_validation, validate_email, validate_password
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
from rest_framework import permissions, viewsets
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from django.contrib.auth.models import User
from .models import AppUser
from .serializers import UserProfileSerializer
import uuid
from django.middleware.csrf import get_token


import logging

# Get the custom user model
UserModel = get_user_model()

@method_decorator(csrf_protect, name = 'dispatch')
class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        # You may not need custom_validation, unless you have custom logic
        # If you do, ensure it's correctly cleaning the data
        clean_data = custom_validation(request.data) if custom_validation else request.data

        serializer = UserRegisterSerializer(data=clean_data)
        if serializer.is_valid():
            user = serializer.save()  # save method will internally call create()
            return Response({
                'message': 'User registered successfully',
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'balance': user.balance
                }
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
logger = logging.getLogger(__name__)


@method_decorator(csrf_protect, name = 'dispatch')
class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        logger.debug(f"Request data: {request.data}")
        data = request.data

        username = data.get('username', '').strip()
        password = data.get('password', '')

        if not username:
            return Response({'detail': 'Username is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not password:
            return Response({'detail': 'Password is required.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserLoginSerializer(data={'username': username, 'password': password})
        if serializer.is_valid():
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                user.last_login = now()
                user.save()

                return Response({
                    'message': 'Login successful',
                    'user': {
                        'username': user.username,
                        'email': user.email,
                        'balance': user.balance
                    }
                }, status=status.HTTP_200_OK)
        

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@method_decorator(csrf_protect, name = 'dispatch')
class CheckLoginStatus(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'message': 'User is logged in.',
                'user': {
                    'username': request.user.username,
                    'email': request.user.email,
                    'balance': request.user.balance
                }
            }, status=200)
        else:
            return Response({'message': 'User is not logged in.'}, status=401)

@method_decorator(csrf_protect, name = 'dispatch')
class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        logout(request)
        return Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)
    
class UserViewSet(viewsets.ModelViewSet):
    
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = UserModel.objects.all().order_by('username')
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class UpdateBalance(APIView):
    
    permission_classes = [IsAuthenticated]
    

    @csrf_exempt
    def post(self, request):
        # Get the current user
        user = request.user
        
        # Get the new balance from the request data
        new_balance = request.data.get('balance')
        
        if new_balance is None:
            return Response({'detail': 'Balance is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update the balance for the user
        user.balance = new_balance
        user.save()

        return Response({'message': 'Balance updated successfully.'}, status=status.HTTP_200_OK)
    
    
@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions. AllowAny, )
    def get(self, request, format=None):
        token = get_token(request)
        return Response({"token": token}, status=200)


class GetUsersView(APIView):
    permission_classes = (permissions.AllowAny, )
    def get(self, request, format=None) :
        users = UserModel.objects.all()

        users = UserSerializer(users, many=True)
        return Response (users.data)
    
class GetUserProfileView(APIView):
    def get(self, request, format=None):

        user = self.request.user
        username = user.username

        user_profile = UserModel.objects.get(email=user.email)

       # user_profile = AppUser.objects.filter(user=user)
        user_profile = UserProfileSerializer(user_profile)

        return Response({ 'profile': user_profile.data, 'username': str(username) })
    

class UpdateUserBalanceView(APIView):
    def put (self, request, format=None):
        user = self.request.user
        balance = user.balance

        data = self.request.data

        balance = data['balance']

        user_profile = UserModel.objects.get(email=user.email)

        AppUser.objects.filter(email=user.email).update(balance=balance)

        user_profile = UserProfileSerializer(user_profile)

        return Response({ 'profile': user_profile.data, 'balance' : balance})
    
class GetUserBalance(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Assuming the User model has a 'balance' field
        user = self.request.user
        balance = user.balance  # Get balance from the logged-in user
        return Response({'balance': balance})