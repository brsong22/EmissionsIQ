from fastapi import APIRouter, HTTPException
from app.services.emissions_service import EmissionsService, RouteRequest

# Create versioned routers
v1_router = APIRouter(prefix="/v1")
emissions_service = EmissionsService()

@v1_router.post("/calculate-emissions")
async def calculate_emissions(request: RouteRequest):
    """Calculate route and emissions between two points."""
    result = await emissions_service.calculate_route(request)
    if not result:
        raise HTTPException(status_code=400, detail="Could not calculate route")
    return result

@v1_router.get("/compare-modes")
async def compare_modes(origin: str, destination: str):
    """Compare emissions between different transportation modes."""
    modes = ["DRIVE", "BICYCLE", "WALK"]
    results = await emissions_service.compare_modes(origin, destination, modes)
    return results

# Create the main router that includes versioned routers
router = APIRouter()
router.include_router(v1_router) 