# EmissionsIQ

EmissionsIQ is a web application that calculates carbon emissions for different transportation routes. It provides real-time route visualization and emissions data to help users make environmentally conscious travel decisions.

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Google Maps API
- Jest & Testing Library

### Backend
- FastAPI
- Python
- Google Maps API
- Pydantic
- pytest

## Prerequisites

- Node.js 18+
- Python 3.11+
- Google Maps API key with the following APIs enabled:
  - Maps JavaScript API
  - Geocoding API
  - Routes API

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/EmissionsIQ.git
cd EmissionsIQ
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate 
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

4. Create environment files:

Backend (`.env`):
```
GOOGLE_MAPS_API_KEY=your_api_key_here
```

Frontend (`.env.local`):
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Running the Application

1. Start the backend server:
```bash
cd backend
uvicorn app.main:app --reload
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
pytest
```
