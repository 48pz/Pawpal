import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

/* ---------------- Leaflet icon fix ---------------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ---------------- Constants ---------------- */
const DEFAULT_CENTER = { lat: -27.4698, lng: 153.0251 }; // Brisbane

/* ---------------- Helpers ---------------- */
function ClickToSelect({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });
  return null;
}

function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position?.lat && position?.lng) {
      map.flyTo([position.lat, position.lng], 16, {
        duration: 0.8,
      });
    }
  }, [position, map]);

  return null;
}

async function searchAddress(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query
  )}&addressdetails=1&limit=5`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

async function reverseGeocode(lat, lng) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Reverse geocode failed");
  return res.json();
}

/* ---------------- Component ---------------- */
export default function LocationPicker({ value, onChange, error }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---- Search debounce ---- */
  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const data = await searchAddress(query);
        setResults(data);
      } catch {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  /* ---- Pick from search result ---- */
  const handleSelectResult = (item) => {
    const lat = Number(item.lat);
    const lng = Number(item.lon);

    onChange({
      lat,
      lng,
      name: item.display_name,
    });

    setQuery(item.display_name);
    setResults([]);
  };

  /* ---- Pick from map click ---- */
  const handlePickOnMap = async ({ lat, lng }) => {
    setLoading(true);
    try {
      const data = await reverseGeocode(lat, lng);
      onChange({
        lat,
        lng,
        name:
          data.display_name || `Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)}`,
      });
      setQuery(data.display_name || "");
    } finally {
      setLoading(false);
      setResults([]);
    }
  };

  const center = value?.lat
    ? { lat: value.lat, lng: value.lng }
    : DEFAULT_CENTER;

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-300">Location</label>

      {/* -------- Search input -------- */}
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search address (e.g. South Bank Parklands)"
        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
      />

      {/* -------- Search results -------- */}
      {results.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-[#111] overflow-hidden">
          {results.map((r) => (
            <button
              key={r.place_id}
              type="button"
              onClick={() => handleSelectResult(r)}
              className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/5"
            >
              {r.display_name}
            </button>
          ))}
        </div>
      )}

      {/* -------- Map -------- */}
      <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#111]">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={value?.lat ? 16 : 13}
          style={{ height: 320, width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 🔑 关键：同步视角 */}
          <MapController position={value} />

          <ClickToSelect onPick={handlePickOnMap} />

          {value?.lat && <Marker position={[value.lat, value.lng]} />}
        </MapContainer>
      </div>

      {/* -------- Address output -------- */}
      <div className="min-h-4.5">
        {loading ? (
          <p className="text-xs text-gray-400">Resolving address…</p>
        ) : value?.name ? (
          <p className="text-xs text-gray-400 truncate">Address: {value.name}</p>
        ) : null}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
