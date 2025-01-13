from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model, authenticate
from rest_framework.views import APIView
from .serializers import UserSerializer
from .models import UserProfile
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAdminUser, IsAuthenticated

# Create your views here.

User = get_user_model()


@api_view(["GET"])
def getRoutes(request):
    routes = [
        "api/token",
        "api/token/refresh",
    ]

    return Response(routes)


class SignupView(APIView):
    def post(self, request):
        data = request.data
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            UserProfile.objects.create(user=user)
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        data = request.data
        email = data.get("email")
        password = data.get("password")
        try:
            user = User.objects.get(email=email)
            if user.check_password(password):
                if not user.is_active:
                    return Response(
                        {"error": "Your account is blocked"},
                        status=status.HTTP_403_FORBIDDEN,
                    )
                token_response = RefreshToken.for_user(user)
                return Response(
                    {
                        "user": {
                            "id": user.id,
                            "first_name": user.first_name,
                            "last_name": user.last_name,
                            "username": user.username,
                            "email": user.email,
                        },
                        "access_token": str(token_response.access_token),
                        "refresh_token": str(token_response),
                    }
                )
            else:
                return Response(
                    {"error": "Invalid Password"}, status=status.HTTP_401_UNAUTHORIZED
                )
        except user.DoesNotExist:
            return Response(
                {"error": "Invalid Email"}, status=status.HTTP_404_NOT_FOUND
            )


# admin
class AdminTokenObtainView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        user = authenticate(
            email=request.data.get("email"), password=request.data.get("password")
        )
        if user and user.is_superadmin:
            response = super().post(request, *args, **kwargs)
            response.data["user"] = {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
            response.data["admin_token"] = response.data["access"]
            response.data["refresh_token"] = response.data["refresh"]
            return response
        return Response(
            {"detail": "Only superusers are allowed"}, status=status.HTTP_403_FORBIDDEN
        )


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        active_users = User.objects.filter(is_active=True, is_superadmin=False)
        inactive_users = User.objects.filter(is_active=False, is_superadmin=False)

        active_serializer = UserSerializer(active_users, many=True)
        inactive_serializer = UserSerializer(inactive_users, many=True)

        return Response(
            {
                "message": "Welcome to the admin dashboard",
                "active_users": active_serializer.data,
                "inactive_users": inactive_serializer.data,
            }
        )

    def post(self, request):
        user_id = request.data.get("user_id")
        try:
            user = User.objects.get(id=user_id)
            user.is_active = not user.is_active
            user.save()
            return Response(
                {"status": "success", "user_id": "user.id", "is_active": user.is_active}
            )
        except User.DoesNotExist:
            return Response(
                {"status": "error", "message": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdminUser])
def toggle_user_status(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_active = not user.is_active
        user.save()
        return Response({"status": "success", "is_active": user.is_active})
    except User.DoesNotExist:
        return Response(
            {"status": "error", "message": "User not found"},
            status=status.HTTP_404_NOT_FOUND,
        )


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = UserProfile.objects.get(user=request.user)
        return Response(
            {
                "first_name": request.user.first_name,
                "last_name": request.user.last_name,
                "email": request.user.email,
                "username": request.user.username,
                "profile_picture": (
                    request.build_absolute_uri(profile.profile_picture.url)
                    if profile.profile_picture
                    else None
                ),
            }
        )

    def put(self, request):
        profile = UserProfile.objects.get(user=request.user)
        if "first_name" in request.data:
            request.user.first_name = request.data["first_name"]
            request.user.save()
        if "last_name" in request.data:
            request.user.last_name = request.data["last_name"]
            request.user.save()
        if "email" in request.data:
            email = request.data["email"]
            request.user.email = email
            request.user.save()
        if "username" in request.data:
            request.user.username = request.data["username"]
            request.user.save()
        if "profile_picture" in request.FILES:
            profile.profile_picture = request.FILES["profile_picture"]
            profile.save()
        return Response({"message": "Profile updated successfully"})


class AdminUserProfileView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request, user_id=None):

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        profile = UserProfile.objects.get(user=user)
        return Response(
            {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "username": user.username,
                "profile_picture": (
                    request.build_absolute_uri(profile.profile_picture.url)
                    if profile.profile_picture
                    else None
                ),
            }
        )

    def put(self, request, user_id=None):

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

        profile = UserProfile.objects.get(user=user)
        data = request.data

        if "first_name" in data:
            user.first_name = data["first_name"]
        if "last_name" in data:
            user.last_name = data["last_name"]
        if "email" in data:
            email = data["email"]
            user.email = email
        if "username" in data:
            user.username = data["username"]

        user.save()

        if "profile_picture" in request.FILES:
            profile.profile_picture = request.FILES["profile_picture"]
            profile.save()
        return Response({"message": "Profile updated successfully"})


# class UserProfileView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, user_id=None):
#         if request.user.is_superadmin and user_id:
#             user = User.objects.get(id=user_id)
#         else:
#             user = request.user
#         profile = UserProfile.objects.get(user=user)
#         return Response(
#             {
#                 "first_name": user.first_name,
#                 "last_name": user.last_name,
#                 "email": user.email,
#                 "username": user.username,
#                 "profile_picture": (
#                     request.build_absolute_uri(profile.profile_picture.url)
#                     if profile.profile_picture
#                     else None
#                 ),
#             }
#         )

#     def put(self, request, user_id=None):
#         if request.user.is_superadmin and user_id:
#             user = User.objects.get(id=user_id)
#         else:
#             user = request.user
#         profile = UserProfile.objects.get(user=user)
#         if "first_name" in request.data:
#             user.first_name = request.data["first_name"]
#             user.save()
#         if "last_name" in request.data:
#             user.last_name = request.data["last_name"]
#             user.save()
#         if "email" in request.data:
#             email = request.data["email"]
#             user.email = email
#             user.save()
#         if "username" in request.data:
#             user.username = request.data["username"]
#             user.save()
#         if "profile_picture" in request.FILES:
#             profile.profile_picture = request.FILES["profile_picture"]
#             profile.save()
#         return Response({"message": "Profile updated successfully"})


@api_view(["POST"])
@permission_classes([IsAdminUser])
def admin_create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        UserProfile.objects.create(user=user)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
