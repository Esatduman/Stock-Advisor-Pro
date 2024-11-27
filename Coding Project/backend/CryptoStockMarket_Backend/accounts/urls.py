from django.urls import path, include
from rest_framework import routers

from . import views
from . import utility
from .views import GetCSRFToken

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)

urlpatterns = [
    
    path('', include(router.urls)),
    path('market-news/', utility.get_market_news, name='market_news'),
    path('market-trends/', utility.get_market_indices, name='market_trends'),
    path('market-gainers/', utility.get_market_sectors, name='market_gainers'),
	path('signup/', views.UserRegister.as_view(), name='signup'),  # User registration
    path('login/', views.UserLogin.as_view(), name='login'),      # User login
    path('logout/', views.UserLogout.as_view(), name='logout'),    # User logout
    path('check-login/', views.CheckLoginStatus.as_view(), name='check_login'),
	#path('user', views.UserView.as_view(), name='user'),
    path('csrf_cookie/', views.GetCSRFToken.as_view(), name='csrf_cookie'),
    path('get_users/', views.GetUsersView.as_view(), name='get_users'),
    path('user/', views.GetUserProfileView.as_view(), name='user'),
    path('update_balance/', views.UpdateUserBalanceView.as_view(), name='update_balance'),
    path('update_stocks/', views.BuyStockView.as_view(), name='update_stocks'),
    path('get_balance/', views.GetUserBalance.as_view(), name='get_balance'),
    path('stock_price/', utility.get_stock_price, name='stock_price'),
    path('get_user_stocks/', views.GetUserStocksView.as_view(), name='get_user_stocks'),  # Get user's stocks
    path('sell_stocks/', views.SellStockView.as_view(), name='sell_stocks'),
    path('current_holdings/', views.GetCurrentHoldings.as_view(), name='current_holdings'),
    path('initial_balance/', views.GetUserInitialBalance.as_view(), name='initial_balance'),


]