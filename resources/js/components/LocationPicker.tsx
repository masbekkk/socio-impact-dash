import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
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
    existingLocations?: Array<{ id?: string, lat: number, lng: number, address?: string }>;
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

export default function LocationPicker({ onLocationSelect, initialLat = -6.2088, initialLng = 106.8456, initialAddress = '', readOnly = false, existingLocations = [] }: LocationPickerProps) {
    const [position, setPosition] = useState<L.LatLng>(new L.LatLng(initialLat, initialLng));
    const [address, setAddress] = useState(initialAddress);

    // Search & Autocomplete State
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const markerRef = useRef<L.Marker>(null);

    // Initial load handling
    useEffect(() => {
        if (initialLat && initialLng) {
            const initialPos = new L.LatLng(initialLat, initialLng);
            setPosition(initialPos);

            if (initialAddress) {
                setAddress(initialAddress);
            } else {
                // Fetch address if not provided but coords are
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${initialLat}&lon=${initialLng}`)
                    .then(res => res.json())
                    .then(data => {
                        const addr = data.display_name || `${initialLat}, ${initialLng}`;
                        setAddress(addr);
                    })
                    .catch(err => console.error(err));
            }
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

    // Autocomplete Input Handler
    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
                const data = await response.json();
                setSuggestions(data || []);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            } finally {
                setIsSearching(false);
            }
        }, 500); // 500ms debounce
    };

    const selectSuggestion = (item: any) => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        const newPos = new L.LatLng(lat, lon);

        setPosition(newPos);
        setAddress(item.display_name);
        setSearchQuery(item.display_name);
        setSuggestions([]); // Clear suggestions

        if (onLocationSelect) onLocationSelect(lat, lon, item.display_name);
    };

    // Manual Submit Search
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prioritize suggestion if exists
        if (suggestions.length > 0) {
            selectSuggestion(suggestions[0]);
            return;
        }

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

    // Update address when pin is drag/moved manually
    useEffect(() => {
        // Only fetch if position changed significantly to avoid loops, 
        // but here we rely on dependency array. 
        // We skip fetch on initial render if address is already set (handled by other effect),
        // but simple implementation is fine for now.
        // fetchAddress(position.lat, position.lng);
    }, [position]);
    // Commented out above to prevent auto-fetch spam. 
    // We only fetch on dragEnd or explicit validation.
    // Actually, user wants to see address when clicking map:

    // Separate effect for Click/Drag updates:
    const handleMarkerDragEnd = () => {
        const marker = markerRef.current;
        if (marker) {
            const newPos = marker.getLatLng();
            setPosition(newPos);
            fetchAddress(newPos.lat, newPos.lng);
        }
    };

    return (
        <div className="space-y-4">
            <div className="relative w-full h-[350px] rounded-lg overflow-hidden border border-input shadow-sm">

                {/* Search Overlay */}
                {!readOnly && (
                    <div className="absolute top-3 left-12 right-3 md:left-auto md:right-3 md:w-80 z-[1000] flex flex-col gap-1">
                        <div className="bg-background/80 backdrop-blur-md p-1 rounded-xl shadow-sm border border-white/20">
                            <form onSubmit={handleSearch} className="flex gap-2 relative">
                                <Input
                                    value={searchQuery}
                                    onChange={handleSearchInput}
                                    placeholder="Cari Lokasi..."
                                    className="bg-white/80 border-transparent focus:bg-background h-9 text-sm shadow-inner pr-8"
                                />
                                <Button type="submit" size="sm" variant="ghost" className="absolute right-0 top-0 h-9 w-9 p-0 hover:bg-transparent text-muted-foreground" disabled={isSearching}>
                                    {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                </Button>
                            </form>
                        </div>

                        {/* Autocomplete Dropdown */}
                        {suggestions.length > 0 && (
                            <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden max-h-60 overflow-y-auto w-full z-[1001]">
                                {suggestions.map((item, idx) => (
                                    <button
                                        key={idx}
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 border-b last:border-0 transition-colors flex items-start gap-2"
                                        onClick={() => selectSuggestion(item)}
                                    >
                                        <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground shrink-0" />
                                        <span className="line-clamp-2">{item.display_name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
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

                    {/* Main Draggable Marker */}
                    <Marker
                        position={position}
                        draggable={!readOnly}
                        ref={markerRef}
                        eventHandlers={{
                            dragend: handleMarkerDragEnd,
                        }}
                    >
                        {!readOnly && <Popup>Lokasi Baru (Geser untuk ubah)</Popup>}
                    </Marker>

                    {/* Existing Locations Markers - Visual Only */}
                    {existingLocations.map((loc, idx) => (
                        <Marker
                            key={loc.id || `loc-${idx}`}
                            position={[loc.lat, loc.lng]}
                            opacity={0.6} // Semi-transparent to distinguish from active marker
                            title={loc.address}
                        >
                            <Popup>
                                <div className="text-xs">
                                    <strong>Lokasi {idx + 1}</strong>
                                    <p className="mt-1">{loc.address}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Click Handler -> Update main marker position */}
                    {!readOnly && (
                        <ClickHandler setPosition={(pos) => {
                            setPosition(pos);
                            fetchAddress(pos.lat, pos.lng);
                        }} />
                    )}

                    <MapUpdater position={position} />
                </MapContainer>
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
                </div>
                <p className="text-[10px] text-muted-foreground">Contoh: Menara BCA, Jakarta Pusat</p>
            </div>
        </div>
    );
}
