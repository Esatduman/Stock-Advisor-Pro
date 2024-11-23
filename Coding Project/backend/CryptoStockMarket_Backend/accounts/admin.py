from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import AppUser

class AppUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'is_active', 'is_admin')
    search_fields = ('email', 'username')
    list_filter = ('is_active', 'is_admin')
    
    # Removed filter_horizontal for 'groups' and 'user_permissions'
    filter_horizontal = ()  # No longer referencing non-existing fields
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username',)}),
        ('Permissions', {'fields': ('is_active', 'is_admin')}),
        ('Important dates', {'fields': ('last_login',)}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_active', 'is_admin'),
        }),
    )

    model = AppUser

admin.site.register(AppUser, AppUserAdmin)
