import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
/* empty css                 */
import L from "leaflet";
import { I as Input } from "./input-BYMPkoD-.js";
import { B as Button } from "./button-hAi0Fg-Q.js";
import { Loader2, Search, MapPin } from "lucide-react";
const markerIcon2x = "/build/assets/marker-icon-2x-_ZA0WGCc.png";
const markerIcon = "/build/assets/marker-icon-hN30_KVU.png";
const markerShadow = "/build/assets/marker-shadow-f7SaPCxT.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});
function ClickHandler({ setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    }
  });
  return null;
}
function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, map.getZoom());
  }, [position, map]);
  return null;
}
function LocationPicker({ onLocationSelect, initialLat = -6.2088, initialLng = 106.8456, initialAddress = "", readOnly = false, existingLocations = [] }) {
  const [position, setPosition] = useState(new L.LatLng(initialLat, initialLng));
  const [address, setAddress] = useState(initialAddress);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);
  const markerRef = useRef(null);
  useEffect(() => {
    if (initialLat && initialLng) {
      const initialPos = new L.LatLng(initialLat, initialLng);
      setPosition(initialPos);
      if (initialAddress) {
        setAddress(initialAddress);
      } else {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${initialLat}&lon=${initialLng}`).then((res) => res.json()).then((data) => {
          const addr = data.display_name || `${initialLat}, ${initialLng}`;
          setAddress(addr);
        }).catch((err) => console.error(err));
      }
    }
  }, [initialLat, initialLng, initialAddress]);
  const fetchAddress = async (lat, lng) => {
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
  const handleSearchInput = (e) => {
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
    }, 500);
  };
  const selectSuggestion = (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const newPos = new L.LatLng(lat, lon);
    setPosition(newPos);
    setAddress(item.display_name);
    setSearchQuery(item.display_name);
    setSuggestions([]);
    if (onLocationSelect) onLocationSelect(lat, lon, item.display_name);
  };
  const handleSearch = async (e) => {
    e.preventDefault();
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
  useEffect(() => {
  }, [position]);
  const handleMarkerDragEnd = () => {
    const marker = markerRef.current;
    if (marker) {
      const newPos = marker.getLatLng();
      setPosition(newPos);
      fetchAddress(newPos.lat, newPos.lng);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative w-full h-[350px] rounded-lg overflow-hidden border border-input shadow-sm", children: [
    !readOnly && /* @__PURE__ */ jsxs("div", { className: "absolute top-3 left-12 right-3 md:left-auto md:right-3 md:w-80 z-[1000] flex flex-col gap-1", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-background/80 backdrop-blur-md p-1 rounded-xl shadow-sm border border-white/20", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "flex gap-2 relative", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            value: searchQuery,
            onChange: handleSearchInput,
            placeholder: "Cari Lokasi...",
            className: "bg-white/80 border-transparent focus:bg-background h-9 text-sm shadow-inner pr-8"
          }
        ),
        /* @__PURE__ */ jsx(Button, { type: "submit", size: "sm", variant: "ghost", className: "absolute right-0 top-0 h-9 w-9 p-0 hover:bg-transparent text-muted-foreground", disabled: isSearching, children: isSearching ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }) })
      ] }) }),
      suggestions.length > 0 && /* @__PURE__ */ jsx("div", { className: "bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden max-h-60 overflow-y-auto w-full z-[1001]", children: suggestions.map((item, idx) => /* @__PURE__ */ jsxs(
        "button",
        {
          className: "w-full text-left px-3 py-2 text-xs hover:bg-gray-100 border-b last:border-0 transition-colors flex items-start gap-2",
          onClick: () => selectSuggestion(item),
          children: [
            /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3 mt-0.5 text-muted-foreground shrink-0" }),
            /* @__PURE__ */ jsx("span", { className: "line-clamp-2", children: item.display_name })
          ]
        },
        idx
      )) })
    ] }),
    /* @__PURE__ */ jsxs(
      MapContainer,
      {
        center: position,
        zoom: 15,
        scrollWheelZoom: !readOnly,
        dragging: !readOnly,
        doubleClickZoom: !readOnly,
        style: { height: "100%", width: "100%" },
        attributionControl: false,
        children: [
          /* @__PURE__ */ jsx(
            TileLayer,
            {
              attribution: "©",
              url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
          ),
          /* @__PURE__ */ jsx(
            Marker,
            {
              position,
              draggable: !readOnly,
              ref: markerRef,
              eventHandlers: {
                dragend: handleMarkerDragEnd
              },
              children: !readOnly && /* @__PURE__ */ jsx(Popup, { children: "Lokasi Baru (Geser untuk ubah)" })
            }
          ),
          existingLocations.map((loc, idx) => /* @__PURE__ */ jsx(
            Marker,
            {
              position: [loc.lat, loc.lng],
              opacity: 0.6,
              title: loc.address,
              children: /* @__PURE__ */ jsx(Popup, { children: /* @__PURE__ */ jsxs("div", { className: "text-xs", children: [
                /* @__PURE__ */ jsxs("strong", { children: [
                  "Lokasi ",
                  idx + 1
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-1", children: loc.address })
              ] }) })
            },
            loc.id || `loc-${idx}`
          )),
          !readOnly && /* @__PURE__ */ jsx(ClickHandler, { setPosition: (pos) => {
            setPosition(pos);
            fetchAddress(pos.lat, pos.lng);
          } }),
          /* @__PURE__ */ jsx(MapUpdater, { position })
        ]
      }
    )
  ] });
}
export {
  LocationPicker as L
};
