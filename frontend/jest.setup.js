import '@testing-library/jest-dom';

// Mock the Google Maps API
global.google = {
    maps: {
        Map: jest.fn(),
        Polyline: jest.fn(),
        LatLng: jest.fn(),
        LatLngBounds: jest.fn(),
        event: {
            addListener: jest.fn(),
            removeListener: jest.fn(),
        },
    },
}; 