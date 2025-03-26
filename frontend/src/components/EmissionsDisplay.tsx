interface EmissionsData {
    distance: number;  // in meters
    emissions: number;  // in kg CO2
    duration: number;  // in seconds
    mode: string;      // transport mode
}

interface EmissionsDisplayProps {
    data: EmissionsData | null;
}

const EmissionsDisplay = ({ data }: EmissionsDisplayProps) => {
    if (!data) {
        return (
            <div className="bg-gray-800 p-4 rounded-lg shadow">
                <p className="text-gray-400">Enter a route to calculate emissions</p>
            </div>
        );
    }

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 text-white">Route Information</h3>
            <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-400">Distance:</span>
                    <span className="font-medium text-white">{(data.distance / 1000).toFixed(2)} km</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="font-medium text-white">{formatDuration(data.duration)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Emissions:</span>
                    <span className="font-medium text-white">{data.emissions.toFixed(2)} kg CO2</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Mode:</span>
                    <span className="font-medium text-white">{data.mode.toLowerCase()}</span>
                </div>
            </div>
        </div>
    );
};

export default EmissionsDisplay; 