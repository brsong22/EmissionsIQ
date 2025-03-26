import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Map from '../Map';

// Mock the Google Maps API
const mockUseLoadScript = jest.fn().mockReturnValue({ isLoaded: true });

jest.mock('@react-google-maps/api', () => ({
    useLoadScript: () => mockUseLoadScript(),
    GoogleMap: ({ children, mapContainerStyle }: { children: React.ReactNode; mapContainerStyle: any }) => {
        console.log('GoogleMap rendered with style:', mapContainerStyle);
        return (
            <div data-testid="google-map" style={mapContainerStyle}>
                {children}
            </div>
        );
    },
    Polyline: () => <div data-testid="polyline" />,
    Libraries: ['geometry']
}));

// Mock google.maps
global.google = {
    maps: {
        geometry: {
            encoding: {
                decodePath: () => []
            }
        },
        LatLngBounds: class {
            extend() { }
        },
        Map: class { }
    }
} as any;

describe('Map', () => {
    const mockCenter = {
        lat: 37.7749,
        lng: -122.4194
    };

    beforeEach(() => {
        // Reset the mock before each test
        mockUseLoadScript.mockReturnValue({ isLoaded: true });
    });

    it('renders loading state when not loaded', () => {
        mockUseLoadScript.mockReturnValue({ isLoaded: false });
        render(<Map center={mockCenter} />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders map with center coordinates', () => {
        render(<Map center={mockCenter} />);
        expect(screen.getByTestId('google-map')).toBeInTheDocument();
    });

    it('renders polyline when provided', () => {
        const mockPolyline = 'encoded_polyline_string';
        render(<Map center={mockCenter} polyline={mockPolyline} />);
        expect(screen.getByTestId('polyline')).toBeInTheDocument();
    });

    it('uses custom height when provided', () => {
        render(<Map center={mockCenter} height="300px" />);
        const map = screen.getByTestId('google-map');
        expect(map).toHaveStyle({ width: '100%', height: '300px' });
    });
}); 