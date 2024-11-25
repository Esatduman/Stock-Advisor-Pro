# from django.contrib.auth.models import User
# from rest_framework import serializers


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'groups', '']


from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework.exceptions import ValidationError

##User model
UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ['username', 'email', 'password', 'balance']

	def create(self, validated_data):

		balance = validated_data.get('balance', 10000.00) 
		
		user = UserModel.objects.create_user(
			username=validated_data['username'],  # Access validated data (clean data)
			email=validated_data['email'],  # Email field
			password=validated_data['password'],  # Password is automatically hashed
		)
		user.balance = balance
		user.save()
		return user
		
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

    def check_user(self, clean_data):
        user = authenticate(username=clean_data['username'], password=clean_data['password'])
        if not user:
            raise ValidationError('Invalid username or password.')
        return user

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('email', 'username', 'balance' )

class UserProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = '__all__'