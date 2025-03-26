'use client';

import { useEffect, useState } from 'react';
import Map from '@/components/Map';
import RouteForm from '@/components/RouteForm';
import EmissionsDisplay from '@/components/EmissionsDisplay';
import axios from 'axios';

interface RouteData {
    distance: number;  // in meters
    emissions: number;  // in kg CO2
    duration: number;  // in seconds
    polyline: string;
    mode: string;      // transport mode
}

export default function Home() {
    const [routeData, setRouteData] = useState<RouteData | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRouteSubmit = async (origin: string, destination: string, mode: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8000/api/v1/calculate-emissions', {
                origin,
                destination,
                mode
            });

            setRouteData({ ...response.data, mode });
        } catch {
            setError('Failed to calculate route. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
            });
        } else {
            setUserLocation({ lat: 37.7749, lng: -122.4194 });
        }
        setLoading(false);
    }, []);

    return (
        <main className="min-h-screen bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-white">EmissionsIQ</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <RouteForm onSubmit={handleRouteSubmit} />
                        {loading && (
                            <div className="text-center py-4" role="status">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}
                        {routeData && <EmissionsDisplay data={routeData} />}
                    </div>

                    <div className="bg-gray-800 rounded-lg shadow overflow-hidden">
                        {userLocation ? (
                            <Map
                                center={userLocation}
                                polyline={routeData?.polyline}
                                height="600px"
                            />
                        ) : (
                            <div className="h-[600px] flex items-center justify-center">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                    <p className="text-gray-400">Getting your location...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
