from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model, logout, login
from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer, DashboardSerializer, UpdateDashbaordSerializer
import time
from rest_framework.permissions import IsAuthenticated

User = get_user_model()

# UI pages
def login_page(request):
    timestamp = str(int(time.time()))
    return render(request, "accounts/login.html", {"cache" : timestamp})

def register_page(request):
    timestamp = str(int(time.time()))
    return render(request, "accounts/register.html", {"cache" : timestamp})

@login_required
def home_page(request):
    employees = User.objects.all().order_by("id")
    timestamp = str(int(time.time()))
    return render(request, "accounts/home.html", {
        "employees": employees,
        "role": request.user.role,
        "cache" : timestamp
    })

@login_required
def logout_view(request):
    logout(request)
    return redirect('/')

@login_required
def hr_dashboard(request):
    timestamp = str(int(time.time()))
    if request.user.role != "HR":
        return redirect('/home/')
    return render(request, "accounts/hr_dashboard.html", {"cache" : timestamp})

@login_required
def manager_dashboard(request):
    timestamp = str(int(time.time()))
    if request.user.role != "MANAGER":
        return redirect('/home/')
    return render(request, "accounts/manager_dashboard.html", {"cache" : timestamp})

# APIs
class RegisterAPIView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": True,
                "msg": "Registration successful"
            })
        return Response({
            "status": False,
            "errors": list(serializer.errors.values())[0][0]
        })


class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            return Response({
                "status": True,
                "msg": "Login successful"
            })
        
        print(f"serializer.errors : {serializer.errors}")

        return Response({
            "status": False,
            "msg": list(serializer.errors.values())[0][0]
        })

class DashboardAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        query = User.objects.all().order_by("id")
        serialized_records = DashboardSerializer(query, many=True)
        return Response({"status": True, "records": serialized_records.data})

    def post(self, request):
        username = request.data.get("username")
        user = User.objects.get(username=username)

        if not user:
            return Response({"status": False, "msg": "Record not found"})

        serializer = UpdateDashbaordSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"status": True, "msg": f"{username} Records Updated successfully"})

        return Response({"status": False, "msg": list(serializer.errors.values())[0][0]})
    
    def delete(self, request):
        username = request.data.get("username")
        if not User.objects.filter(username=username).exists():
            return Response({"status": True, "msg": f"{username} Record not found"})
        
        User.objects.filter(username=username).delete()
        return Response({"status": True, "msg": f"{username} Record deleted successfully"})
    
# Manager Dashboard function
class ManagerDashboardApiView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        username = request.data.get("username")
        if User.objects.filter(username=username).exists():
            return Response({"status": False, "msg": f"Employee {username} Already Exists.. !"})
        serializer_data = RegisterSerializer(data=request.data)
        if serializer_data.is_valid():
            serializer_data.save()
            return Response({"status": True, "msg": f"Employee {username} Created Successfully !"})
        else:
           return Response({"status": False, "msg": list(serializer_data.erros.value())[0][0]}) 