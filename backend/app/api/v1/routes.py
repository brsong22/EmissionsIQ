from fastapi import APIRouter, HTTPException
from app.services.emissions_service import EmissionsService, RouteRequest

router = APIRouter()
emissions_service = EmissionsService()

@router.post("/calculate-emissions")
async def calculate_emissions(request: RouteRequest):
    """Calculate route and emissions between two points."""
    result = await emissions_service.calculate_route(request)
    if not result:
        raise HTTPException(status_code=400, detail="Could not calculate route")
    return result

@router.get("/compare-modes")
async def compare_modes(origin: str, destination: str):
    """Compare emissions between different transportation modes."""
    modes = ["DRIVE", "BICYCLE", "WALK"]
    results = await emissions_service.compare_modes(origin, destination, modes)
    return results 