import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import EmissionsDisplay from '../EmissionsDisplay';

describe('EmissionsDisplay', () => {
    const mockData = {
        distance: 100000,  // in meters
        emissions: 20,     // in kg CO2
        mode: 'DRIVE',
        duration: 3600,    // in seconds
        polyline: 'encoded_polyline_string'
    };

    it('renders emissions data correctly', () => {
        render(<EmissionsDisplay data={mockData} />);

        expect(screen.getByText(/100.00 km/i)).toBeInTheDocument();
        expect(screen.getByText(/20.00 kg CO2/i)).toBeInTheDocument();
        expect(screen.getByText(/1h 0m/i)).toBeInTheDocument();
        expect(screen.getByText(/drive/i)).toBeInTheDocument();
    });

    it('handles different transport modes', () => {
        const transitData = { ...mockData, mode: 'TRANSIT' };
        render(<EmissionsDisplay data={transitData} />);

        expect(screen.getByText(/Route Information/i)).toBeInTheDocument();
    });

    it('handles missing data gracefully', () => {
        render(<EmissionsDisplay data={null} />);

        expect(screen.getByText(/enter a route to calculate emissions/i)).toBeInTheDocument();
    });
}); 