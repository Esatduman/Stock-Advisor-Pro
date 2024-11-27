from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer, StockSerializer
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
from .models import Stock
from django.db import transaction
from decimal import Decimal


import logging

# Get the custom user model
UserModel = get_user_model()

@method_decorator(csrf_protect, name = 'dispatch')
class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
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
        user = request.user
        
        new_balance = request.data.get('balance')
        
        if new_balance is None:
            return Response({'detail': 'Balance is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
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
        user = self.request.user
        balance = user.balance  
        return Response({'balance': balance})
    
class UpdateUserInitial_BalanceView(APIView):
    def put (self, request, format=None):
        user = self.request.user
        initial_balance = user.initial_balance

        data = self.request.data

        initial_balance = data['initial_balance']

        user_profile = UserModel.objects.get(email=user.email)

        AppUser.objects.filter(email=user.email).update(initial_balance=initial_balance)

        user_profile = UserProfileSerializer(user_profile)

        return Response({ 'profile': user_profile.data, 'initial_balance' : initial_balance})
    
class GetUserInitialBalance(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = self.request.user
        initial_balance = user.initial_balance  
        return Response({'initial_balance': initial_balance})
    
class GetUserStocksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = self.request.user
        stocks = Stock.objects.filter(user_email=user.email)

        stock_serializer = StockSerializer(stocks, many=True)
        return Response({'stocks': stock_serializer.data}, status=status.HTTP_200_OK)
    
@method_decorator(csrf_protect, name='dispatch')  
class BuyStockView(APIView):
    def post(self, request):
        try:
            if not request.user.is_authenticated:
                return Response({"error": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)

            user_email = request.user.email
            ticker = request.data.get('ticker')
            quantity = request.data.get('quantity')
            price = request.data.get('price')


            if not all([ticker, quantity, price]):
                return Response({"error": "All fields (ticker, quantity, price) are required."},
                                 status=status.HTTP_400_BAD_REQUEST)
            try:
                quantity = int(quantity)
                price = Decimal(price)
            except ValueError:
                return Response({"error": "Quantity must be an integer and price must be a float."},
                                 status=status.HTTP_400_BAD_REQUEST)

  
            with transaction.atomic():
                stock = Stock.objects.filter(user_email=user_email, ticker=ticker).first()

                if stock:
                    existing_quantity = stock.quantity
                    new_quantity = existing_quantity + quantity

                    total_cost = (existing_quantity * stock.price) + (quantity * price)
                    weighted_average_price = total_cost / new_quantity

                    stock.quantity = new_quantity
                    stock.price = weighted_average_price
                    stock.save()

                    logger.info(f"Updated stock: {ticker}, New Quantity: {new_quantity}, Average Price: {weighted_average_price}")
                else:
                    Stock.objects.create(
                        user_email=user_email,
                        ticker=ticker,
                        quantity=quantity,
                        price=price
                    )
                    logger.info(f"Created new stock: {ticker}, Quantity: {quantity}, Price: {price}")

            return Response({"success": "Stock successfully updated or created."}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error in BuyStockView: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_protect, name='dispatch')  
class SellStockView(APIView):
    def post(self, request):
        try:
            if not request.user.is_authenticated:
                return Response({"error": "User is not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)

            user_email = request.user.email
            ticker = request.data.get('ticker')
            quantity = request.data.get('quantity')

            if not all([ticker, quantity]):
                return Response({"error": "Both ticker and quantity are required."},
                                 status=status.HTTP_400_BAD_REQUEST)

            try:
                quantity = int(quantity)
            except ValueError:
                return Response({"error": "Quantity must be an integer."}, status=status.HTTP_400_BAD_REQUEST)

            stock = Stock.objects.filter(user_email=user_email, ticker=ticker).first()

            if not stock:
                
                return Response({"error": "You don't own this stock."}, status=status.HTTP_404_NOT_FOUND)

            if stock.quantity < quantity:
                return Response({"error": "You don't have enough shares to sell."}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():
                stock.quantity -= quantity

                if stock.quantity == 0:
                    stock.delete()
                    logger.info(f"Sold all shares of {ticker}. Stock record deleted.")
                else:
                    stock.save()
                    logger.info(f"Sold {quantity} shares of {ticker}. New Quantity: {stock.quantity}")

            return Response({"success": f"Successfully sold {quantity} shares of {ticker}."}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error in SellStockView: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class GetCurrentHoldings(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        stocks = Stock.objects.filter(user_email=user.email)

        stock_serializer = StockSerializer(stocks, many=True)
        return Response(stock_serializer.data, status=status.HTTP_200_OK)