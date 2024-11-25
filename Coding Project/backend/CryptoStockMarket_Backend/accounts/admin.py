from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import AppUser

class AppUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'balance', 'is_active', 'is_admin')  # Added 'id' here
    search_fields = ('email', 'username')
    list_filter = ('is_active', 'is_admin')
    
    filter_horizontal = ()  # Removed filter_horizontal for 'groups' and 'user_permissions'

    # Added 'id' to the fieldsets
    fieldsets = (
        (None, {'fields': ('email', 'password')}),  # Add 'id' here
        ('Personal info', {'fields': ('username', 'balance',)}),
        ('Permissions', {'fields': ('is_active', 'is_admin')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    
    # Added 'id' to add_fieldsets if you want to show it when adding new users (read-only)
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_active', 'is_admin', 'balance'),
        }),
    )

    model = AppUser

# Register the custom user model with the admin
admin.site.register(AppUser, AppUserAdmin)
