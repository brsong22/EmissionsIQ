import pytest
from unittest.mock import patch, AsyncMock
from app.services.emissions_service import EmissionsService, RouteRequest

@pytest.fixture
def emissions_service():
    return EmissionsService()

@pytest.fixture
def mock_geocode_response():
    return {
        "status": "OK",
        "results": [{
            "geometry": {
                "location": {
                    "lat": 38.6270,
                    "lng": -90.1994
                }
            }
        }]
    }

@pytest.fixture
def mock_routes_response():
    return {
        "routes": [{
            "distanceMeters": 100000,  # 100 km
            "duration": "3600s",
            "polyline": {
                "encodedPolyline": "encoded_polyline_string"
            }
        }]
    }

@pytest.mark.asyncio
async def test_get_route_emissions_success(emissions_service, mock_geocode_response, mock_routes_response):
    with patch('httpx.AsyncClient.get') as mock_get, \
         patch('httpx.AsyncClient.post') as mock_post:
        
        # Mock the geocoding responses
        mock_get.side_effect = [
            AsyncMock(json=lambda: mock_geocode_response),
            AsyncMock(json=lambda: mock_geocode_response)
        ]
        
        # Mock the routes API response
        mock_post.return_value = AsyncMock(
            status_code=200,
            json=lambda: mock_routes_response
        )
        
        result = await emissions_service.get_route_emissions(
            "Saint Louis",
            "Seattle",
            "DRIVE"
        )
        
        assert "error" not in result
        assert result["distance_km"] == 100
        assert result["emissions_kg"] == 20  # 100 km * 0.2 kg/km
        assert result["mode"] == "DRIVE"
        assert result["duration_seconds"] == 3600
        assert "polyline" in result

@pytest.mark.asyncio
async def test_get_route_emissions_invalid_location(emissions_service):
    with patch('httpx.AsyncClient.get') as mock_get:
        mock_get.return_value = AsyncMock(
            json=lambda: {"status": "ZERO_RESULTS"}
        )
        
        result = await emissions_service.get_route_emissions(
            "Invalid Location",
            "Seattle",
            "DRIVE"
        )
        
        assert "error" in result
        assert "Could not find location" in result["error"]

@pytest.mark.asyncio
async def test_compare_modes(emissions_service, mock_geocode_response, mock_routes_response):
    with patch('httpx.AsyncClient.get') as mock_get, \
         patch('httpx.AsyncClient.post') as mock_post:
        
        # Mock the geocoding responses
        mock_get.side_effect = [
            AsyncMock(json=lambda: mock_geocode_response),
            AsyncMock(json=lambda: mock_geocode_response)
        ]
        
        # Mock the routes API response
        mock_post.return_value = AsyncMock(
            status_code=200,
            json=lambda: mock_routes_response
        )
        
        results = await emissions_service.compare_modes(
            "Saint Louis",
            "Seattle"
        )
        
        assert len(results) > 0
        # Results should be sorted by emissions
        assert results[0]["emissions_kg"] <= results[-1]["emissions_kg"]

@pytest.mark.asyncio
async def test_calculate_route(emissions_service):
    request = RouteRequest(
        origin="Saint Louis, MO",
        destination="Seattle, WA",
        mode="DRIVE"
    )
    
    result = await emissions_service.calculate_route(request)
    assert result is not None
    assert result.distance > 0
    assert result.duration > 0
    assert result.polyline != ""
    assert result.emissions > 0

@pytest.mark.asyncio
async def test_geocode_address(emissions_service):
    result = await emissions_service._geocode_address("Saint Louis, MO")
    assert result is not None
    assert "lat" in result
    assert "lng" in result
    assert isinstance(result["lat"], float)
    assert isinstance(result["lng"], float)

@pytest.mark.asyncio
async def test_compare_modes(emissions_service):
    results = await emissions_service.compare_modes(
        "Saint Louis, MO",
        "Seattle, WA",
        ["DRIVE", "BICYCLE", "WALK"]
    )
    assert len(results) > 0
    assert all(isinstance(result, dict) for result in results)
    assert all("emissions" in result for result in results) 