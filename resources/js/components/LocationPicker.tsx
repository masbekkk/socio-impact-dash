import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Loader2 } from 'lucide-react';

// Fix for Leaflet default icons in React/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Type hack for Leaflet icon fix
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

interface LocationPickerProps {
    onLocationSelect?: (lat: number, lng: number, address: string) => void;
    initialLat?: number;
    initialLng?: number;
    initialAddress?: string;
    readOnly?: boolean;
}

// Component to handle map clicks
function ClickHandler({ setPosition }: { setPosition: (pos: L.LatLng) => void }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });
    return null;
}

// Component to update map view when position changes
function MapUpdater({ position }: { position: L.LatLng }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(position, map.getZoom());
    }, [position, map]);
    return null;
}

export default function LocationPicker({ onLocationSelect, initialLat = -6.2088, initialLng = 106.8456, initialAddress = '', readOnly = false }: LocationPickerProps) {
    const [position, setPosition] = useState<L.LatLng>(new L.LatLng(initialLat, initialLng));
    const [address, setAddress] = useState(initialAddress);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const markerRef = useRef<L.Marker>(null);

    // Initial load
    useEffect(() => {
        if (initialLat && initialLng) {
            setPosition(new L.LatLng(initialLat, initialLng));
        }
        if (initialAddress) {
            setAddress(initialAddress);
        }
    }, [initialLat, initialLng, initialAddress]);

    // Reverse Geocoding (Coords -> Address)
    const fetchAddress = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await response.json();
            if (data && data.display_name) {
                setAddress(data.display_name);
                if (onLocationSelect) onLocationSelect(lat, lng, data.display_name);
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };

    // Forward Geocoding (Search Query -> Coords)
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const newPos = new L.LatLng(parseFloat(lat), parseFloat(lon));
                setPosition(newPos);
                setAddress(display_name);
                if (onLocationSelect) onLocationSelect(parseFloat(lat), parseFloat(lon), display_name);
            }
        } catch (error) {
            console.error("Error searching location:", error);
        } finally {
            setIsSearching(false);
        }
    };

    // Update address when pin is moved manually
    useEffect(() => {
        // Debounce or just call it? Let's call it for user feedback
        fetchAddress(position.lat, position.lng);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position]);

    const handleMarkerDragEnd = () => {
        const marker = markerRef.current;
        if (marker) {
            const newPos = marker.getLatLng();
            setPosition(newPos);
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative w-full h-[350px] rounded-lg overflow-hidden border border-input shadow-sm">

                {/* Search Overlay - Only show if not readOnly */}
                {!readOnly && (
                    <div className="absolute top-3 left-12 right-3 md:left-auto md:right-3 md:w-80 z-[1000] bg-background/50 backdrop-blur-md p-1 rounded-xl shadow-sm border border-white/20">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari Lokasi..."
                                className="bg-white dark:bg-slate-950/50 backdrop-blur-sm border-transparent focus:bg-background focus:border-input transition-all h-9 text-sm shadow-inner"
                            />
                            <Button type="submit" size="sm" variant="secondary" className="h-9 px-3" disabled={isSearching}>
                                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                            </Button>
                        </form>
                    </div>
                )}

                <MapContainer
                    center={position}
                    zoom={15}
                    scrollWheelZoom={!readOnly}
                    dragging={!readOnly}
                    doubleClickZoom={!readOnly}
                    style={{ height: "100%", width: "100%" }}
                    attributionControl={false}
                >
                    <TileLayer
                        attribution='&copy;'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                        position={position}
                        draggable={!readOnly}
                        ref={markerRef}
                        eventHandlers={{
                            dragend: handleMarkerDragEnd,
                        }}
                    >
                    </Marker>
                    {!readOnly && <ClickHandler setPosition={setPosition} />}
                    <MapUpdater position={position} />
                </MapContainer>

                {/* Satellite/Map Toggle Placeholder (Optional) */}
                {/* <div className="absolute bottom-6 right-14 z-[1000] bg-white rounded shadow text-xs flex">
                     <button className="px-2 py-1 font-bold border-r">Peta</button>
                     <button className="px-2 py-1 text-muted-foreground">Satelit</button>
                </div> */}
            </div>

            <div className="space-y-2">
                <Label className="flex items-center gap-1.5 text-green-600 font-medium">
                    <MapPin className="h-4 w-4" />
                    Lokasi Terpilih
                </Label>
                <div className="relative">
                    <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="pr-10"
                        placeholder="Detail lokasi akan muncul di sini..."
                        disabled={readOnly}
                    />
                    <div className="absolute right-3 top-2.5">
                        {/* Whatsapp icon or Action can go here if needed, consistent with screenshot */}
                    </div>
                </div>
                <p className="text-[10px] text-muted-foreground">e.g Contoh: Surabaya</p>
            </div>
        </div>
    );
}
