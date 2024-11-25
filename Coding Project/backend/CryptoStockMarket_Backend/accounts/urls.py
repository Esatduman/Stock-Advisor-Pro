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
    path('get_balance/', views.GetUserBalance.as_view(), name='get_balance'),
]