from django.urls import path, include
from rest_framework import routers

from . import views
from . import utility

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)

urlpatterns = [
    
    path('', include(router.urls)),
    path('market-news/', utility.get_market_news, name='market_news'),
    path('market-trends/', utility.get_market_indices, name='market_trends'),
	path('signup/', views.UserRegister.as_view(), name='signup'),
	path('login', views.UserLogin.as_view(), name='login'),
	path('logout', views.UserLogout.as_view(), name='logout'),
	path('user', views.UserView.as_view(), name='user'),
]