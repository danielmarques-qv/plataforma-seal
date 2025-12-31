"""
Supabase JWT Authentication for Django Ninja.
Validates JWT tokens and returns the authenticated Profile.
"""
import jwt
from typing import Optional
from django.conf import settings
from ninja.security import HttpBearer
from apps.profiles.models import Profile


class SupabaseJWTAuth(HttpBearer):
    """
    Django Ninja authentication class that validates Supabase JWT tokens.
    Returns the Profile object for the authenticated user.
    """
    
    def authenticate(self, request, token: str) -> Optional[Profile]:
        """
        Validate the JWT token and return the user's Profile.
        """
        try:
            jwt_secret = settings.SUPABASE_JWT_SECRET
            
            # Decode the JWT token using Supabase's JWT secret
            # Supabase uses the raw secret string directly
            payload = jwt.decode(
                token,
                jwt_secret,
                algorithms=['HS256'],
                audience='authenticated'
            )
            
            # Extract user ID from the token
            user_id = payload.get('sub')
            if not user_id:
                return None
            
            # Get or create the profile for this user
            try:
                profile = Profile.objects.get(id=user_id)
                # Attach raw payload for additional data if needed
                request.jwt_payload = payload
                return profile
            except Profile.DoesNotExist:
                # Create a new profile for first-time users
                profile = Profile.objects.create(
                    id=user_id,
                    onboarding_step=0
                )
                request.jwt_payload = payload
                return profile
                
        except jwt.ExpiredSignatureError as e:
            print(f"[AUTH] Token expirado: {e}")
            return None
        except jwt.InvalidTokenError as e:
            print(f"[AUTH] Token inválido: {e}")
            return None
        except Exception as e:
            print(f"[AUTH] Erro geral: {e}")
            return None


class OnboardingStepRequired:
    """
    Dependency to check if user has completed required onboarding step.
    Used for implementing "Cadeados" (locks) on certain endpoints.
    """
    
    def __init__(self, min_step: int = 3):
        self.min_step = min_step
    
    def __call__(self, profile: Profile) -> Profile:
        """
        Check if the profile has the required onboarding step.
        Raises an exception if not.
        """
        if profile.onboarding_step < self.min_step:
            from ninja.errors import HttpError
            raise HttpError(
                403, 
                f"Acesso negado. Complete o onboarding até o passo {self.min_step} para desbloquear esta funcionalidade."
            )
        return profile


# Singleton instances for use in API endpoints
supabase_auth = SupabaseJWTAuth()
require_operational = OnboardingStepRequired(min_step=3)
