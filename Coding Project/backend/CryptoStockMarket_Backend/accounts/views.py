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



import logging

# Get the custom user model
UserModel = get_user_model()

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
                    'email': user.email
                }
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
logger = logging.getLogger(__name__)

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
            user = serializer.check_user({'username': username, 'password': password})
            if user:
                login(request, user)
                user.last_login = now()
                user.save()

                return Response({
                    'message': 'Login successful',
                    'user': {
                        'username': user.username,
                        'email': user.email
                    }
                }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CheckLoginStatus(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated 
    
    @csrf_exempt
    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'message': 'User is logged in.',
                'user': {
                    'username': request.user.username,
                    'email': request.user.email
                }
            }, status=200)
        else:
            return Response({'message': 'User is not logged in.'}, status=401)


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
