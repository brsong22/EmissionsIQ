import { GoogleMap, Polyline, useLoadScript, Libraries } from '@react-google-maps/api';
import { useMemo, useEffect, useRef } from 'react';

interface MapProps {
    center: {
        lat: number;
        lng: number;
    };
    polyline?: string;
    height?: string;
}

const containerStyle = {
    width: '100%',
    height: '500px'
};

const libraries: Libraries = ['geometry'];

const Map = ({ center, polyline, height = '500px' }: MapProps) => {
    const mapRef = useRef<google.maps.Map | null>(null);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries
    });

    const bounds = useMemo(() => {
        if (!polyline) return null;
        try {
            const decodedPath = google.maps.geometry.encoding.decodePath(polyline);
            const bounds = new google.maps.LatLngBounds();
            decodedPath.forEach(point => bounds.extend(point));
            return bounds;
        } catch {
            return null;
        }
    }, [polyline]);

    useEffect(() => {
        if (mapRef.current && bounds) {
            mapRef.current.fitBounds(bounds, 50);
        }
    }, [bounds]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <GoogleMap
            mapContainerStyle={{ ...containerStyle, height }}
            center={center}
            zoom={10}
            options={{
                styles: [
                    {
                        featureType: 'all',
                        elementType: 'geometry',
                        stylers: [{ color: '#242f3e' }]
                    },
                    {
                        featureType: 'all',
                        elementType: 'labels.text.stroke',
                        stylers: [{ color: '#242f3e' }]
                    },
                    {
                        featureType: 'all',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#746855' }]
                    },
                    {
                        featureType: 'administrative.locality',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#d59563' }]
                    },
                    {
                        featureType: 'poi',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#d59563' }]
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'geometry',
                        stylers: [{ color: '#263c3f' }]
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#6b9a76' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry',
                        stylers: [{ color: '#38414e' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#212a37' }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#9ca5b3' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry',
                        stylers: [{ color: '#746855' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry.stroke',
                        stylers: [{ color: '#1f2835' }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#f3d19c' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'geometry',
                        stylers: [{ color: '#17263c' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'labels.text.fill',
                        stylers: [{ color: '#515c6d' }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'labels.text.stroke',
                        stylers: [{ color: '#17263c' }]
                    }
                ],
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false
            }}
            onLoad={(map) => {
                mapRef.current = map;
                if (bounds) {
                    map.fitBounds(bounds, 50);
                }
            }}
        >
            {polyline && (
                <Polyline
                    path={google.maps.geometry.encoding.decodePath(polyline)}
                    options={{
                        strokeColor: '#3B82F6',
                        strokeOpacity: 0.8,
                        strokeWeight: 3
                    }}
                />
            )}
        </GoogleMap>
    );
};

export default Map; 