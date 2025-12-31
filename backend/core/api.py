"""
Main API configuration for SEAL Platform using Django Ninja.
"""
from ninja import NinjaAPI
from ninja.errors import HttpError

from apps.profiles.api import router as profiles_router
from apps.crm.api import router as crm_router
from apps.training.api import router as training_router
from apps.resources.api import router as resources_router
from apps.commissions.api import router as commissions_router
from apps.onboarding.api import router as onboarding_router

api = NinjaAPI(
    title="SEAL Platform API",
    version="1.0.0",
    description="API do Sistema de Estrategistas de Alta Performance - Operações Táticas",
)

# Register all routers
api.add_router("/profiles/", profiles_router, tags=["Perfil do Operador"])
api.add_router("/crm/", crm_router, tags=["Frontline CRM"])
api.add_router("/training/", training_router, tags=["Treinamentos"])
api.add_router("/resources/", resources_router, tags=["Arsenal"])
api.add_router("/commissions/", commissions_router, tags=["Comissões"])
api.add_router("/onboarding/", onboarding_router, tags=["Onboarding"])


@api.exception_handler(HttpError)
def custom_http_error_handler(request, exc):
    """Custom error handler for tactical responses."""
    return api.create_response(
        request,
        {"status": "OPERAÇÃO NEGADA", "detail": str(exc.message)},
        status=exc.status_code,
    )
