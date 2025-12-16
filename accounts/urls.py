from django.urls import path
from .views import (login_page, home_page, register_page, RegisterAPIView, LoginAPIView,
                     logout_view, hr_dashboard, manager_dashboard, DashboardAPIView,
                     ManagerDashboardApiView)

urlpatterns = [
    path('', login_page, name='login'),
    path('register/', register_page, name='register'),
    path('home/', home_page, name='home'),
    path('logout/', logout_view, name='logout'),
    path('hr-dashboard/', hr_dashboard),
    path('manager-dashboard/', manager_dashboard),

    # APIs
    path('api/register/', RegisterAPIView.as_view(), name='api-register'),
    path('api/login/', LoginAPIView.as_view(), name='api-login'),
    path('api/dashboard/', DashboardAPIView.as_view(), name="api-dashboard"),
    path('api/updatedashboard', DashboardAPIView.as_view(), name="update-dashboard"),
    path('api/deletedashbord', DashboardAPIView.as_view(), name="delete-dashboard"),
    path('api/create_employee', ManagerDashboardApiView.as_view(), name="create-employee"),
]