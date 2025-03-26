from fastapi import APIRouter
from app.api.v1.routes import router as v1_router

# Create the main router
router = APIRouter()

# Include versioned routers
router.include_router(v1_router, prefix="/v1") 