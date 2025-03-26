import { useState } from 'react';

interface RouteFormProps {
    onSubmit: (origin: string, destination: string, mode: string) => void;
}

const RouteForm = ({ onSubmit }: RouteFormProps) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [mode, setMode] = useState('DRIVE');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(origin, destination, mode);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-800 rounded-lg shadow">
            <div>
                <label htmlFor="origin" className="block text-sm font-medium text-gray-200">
                    Origin
                </label>
                <input
                    type="text"
                    id="origin"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter origin address"
                    required
                />
            </div>

            <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-200">
                    Destination
                </label>
                <input
                    type="text"
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter destination address"
                    required
                />
            </div>

            <div>
                <label htmlFor="mode" className="block text-sm font-medium text-gray-200">
                    Transport Mode
                </label>
                <select
                    id="mode"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="DRIVE">Drive</option>
                    <option value="TRANSIT">Transit</option>
                    <option value="WALK">Walk</option>
                    <option value="BICYCLE">Bicycle</option>
                </select>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
                Calculate Route
            </button>
        </form>
    );
};

export default RouteForm; 