import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RouteForm from '../RouteForm';

describe('RouteForm', () => {
    const mockOnSubmit = jest.fn();

    beforeEach(() => {
        mockOnSubmit.mockClear();
    });

    it('renders form elements correctly', () => {
        render(<RouteForm onSubmit={mockOnSubmit} />);

        expect(screen.getByLabelText(/origin/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/transport mode/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument();
    });

    it('handles form submission correctly', async () => {
        render(<RouteForm onSubmit={mockOnSubmit} />);

        // Fill in the form
        fireEvent.change(screen.getByLabelText(/origin/i), {
            target: { value: 'Saint Louis' }
        });
        fireEvent.change(screen.getByLabelText(/destination/i), {
            target: { value: 'Seattle' }
        });
        fireEvent.change(screen.getByLabelText(/transport mode/i), {
            target: { value: 'DRIVE' }
        });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

        // Verify callback was called with correct data
        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith('Saint Louis', 'Seattle', 'DRIVE');
        });
    });

    it('validates required fields', async () => {
        render(<RouteForm onSubmit={mockOnSubmit} />);

        // Try to submit without filling in fields
        fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

        // Verify callback was not called
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });
}); 