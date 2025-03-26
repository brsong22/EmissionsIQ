import os
import httpx
from typing import Dict, List, Optional
from pydantic import BaseModel
from dotenv import load_dotenv
import logging

load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
GOOGLE_MAPS_API_URL = "https://routes.googleapis.com/directions/v2:computeRoutes"

class RouteRequest(BaseModel):
    origin: str
    destination: str
    mode: str = "DRIVE"

class RouteResponse(BaseModel):
    distance: float  # in meters
    duration: int  # in seconds
    polyline: str
    emissions: float  # in kg CO2

class EmissionsService:
    def __init__(self):
        self.api_key = GOOGLE_MAPS_API_KEY
        if not self.api_key:
            logger.error("GOOGLE_MAPS_API_KEY not found in environment variables")
            raise ValueError("GOOGLE_MAPS_API_KEY is required")
            
        # Emission factors (in kg CO2 per km) for different transport modes
        self.emission_factors = {
            "DRIVE": 0.2,  # Average car
            "TRANSIT": 0.05,  # Public transport (bus/train)
            "WALK": 0,
            "BICYCLE": 0,
            "MOTORCYCLE": 0.1,
        }

    async def calculate_route(self, request: RouteRequest) -> Optional[RouteResponse]:
        """Calculate route and emissions between origin and destination."""
        try:
            # First, geocode the addresses
            origin_coords = await self._geocode_address(request.origin)
            destination_coords = await self._geocode_address(request.destination)

            if not origin_coords or not destination_coords:
                return None

            # Prepare the request body for Routes API
            request_body = {
                "origin": {
                    "location": {
                        "latLng": {
                            "latitude": origin_coords["lat"],
                            "longitude": origin_coords["lng"]
                        }
                    }
                },
                "destination": {
                    "location": {
                        "latLng": {
                            "latitude": destination_coords["lat"],
                            "longitude": destination_coords["lng"]
                        }
                    }
                },
                "travelMode": request.mode,
                "routingPreference": "TRAFFIC_AWARE",
                "computeAlternativeRoutes": False,
                "routeModifiers": {
                    "vehicleInfo": {
                        "emissionType": "GASOLINE"
                    }
                },
                "languageCode": "en-US",
                "units": "METRIC"
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    GOOGLE_MAPS_API_URL,
                    json=request_body,
                    headers={
                        "Content-Type": "application/json",
                        "X-Goog-Api-Key": self.api_key,
                        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
                    }
                )
                
                if response.status_code != 200:
                    logger.error(f"Error from Routes API: {response.text}")
                    return None

                data = response.json()
                if not data.get("routes"):
                    return None

                route = data["routes"][0]
                distance = route.get("distanceMeters", 0)
                duration = route.get("duration", "0s").replace("s", "")
                polyline = route.get("polyline", {}).get("encodedPolyline", "")

                # Calculate emissions (simplified calculation)
                # Assuming average fuel consumption of 8.5 L/100km and 2.3 kg CO2 per liter
                emissions = (distance / 1000) * (8.5 / 100) * 2.3

                return RouteResponse(
                    distance=distance,
                    duration=int(duration),
                    polyline=polyline,
                    emissions=emissions
                )

        except Exception as e:
            logger.error(f"Error calculating route: {str(e)}")
            return None

    async def _geocode_address(self, address: str) -> Optional[Dict[str, float]]:
        """Geocode an address using Google Maps Geocoding API."""
        try:
            geocoding_url = "https://maps.googleapis.com/maps/api/geocode/json"
            params = {
                "address": address,
                "key": self.api_key
            }

            async with httpx.AsyncClient() as client:
                response = await client.get(geocoding_url, params=params)
                
                if response.status_code != 200:
                    logger.error(f"Error from Geocoding API: {response.text}")
                    return None

                data = response.json()
                if not data.get("results"):
                    return None

                location = data["results"][0]["geometry"]["location"]
                return {
                    "lat": location["lat"],
                    "lng": location["lng"]
                }

        except Exception as e:
            logger.error(f"Error geocoding address: {str(e)}")
            return None

    async def compare_modes(self, origin: str, destination: str, modes: List[str]) -> List[Dict]:
        """Compare emissions between different transportation modes."""
        results = []
        for mode in modes:
            result = await self.calculate_route(RouteRequest(origin=origin, destination=destination, mode=mode))
            if result:
                results.append(result.dict())
        return sorted(results, key=lambda x: x["emissions"]) 