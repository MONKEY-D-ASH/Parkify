"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/Auth";

type Coordinates = [number, number];
type ParkingSpot = {
  id: number;
  position: Coordinates;
  owner: string;
  phone: string;
  price: number;
  size: number;
  available: boolean;
  image: string;
  title: string;
  description: string;
};

// Custom black parking pin with a white car symbol.
const parkingIcon = L.divIcon({
  className: "parkify-marker-wrap",
  html: `<div style="width:38px;height:46px;position:relative;filter:drop-shadow(0 3px 3px rgba(0,0,0,.25));transition:transform .18s ease;">
    <svg width="38" height="46" viewBox="0 0 38 46" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M19 1C9.1 1 1 9.1 1 19c0 13 18 26 18 26s18-13 18-26C37 9.1 28.9 1 19 1Z" fill="#111111" stroke="#FFFFFF" stroke-width="1.5"/>
      <rect x="8.5" y="14" width="21" height="13" rx="3.5" fill="#FFFFFF"/>
      <path d="M12 15l2-4h10l2 4" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 17h14l2 5H10l2-5Z" fill="#111111"/>
      <circle cx="13" cy="25" r="2" fill="#111111"/><circle cx="25" cy="25" r="2" fill="#111111"/>
    </svg>
  </div>`,
  iconSize: [38, 46],
  iconAnchor: [19, 45],
});

function Recenter({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();
  useEffect(() => {
    if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
      map.setView([latitude, longitude], map.getZoom());
    }
  }, [latitude, longitude, map]);
  return null;
}

const parkingImages = [
  "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1597766353939-1f4b7b2e2c8a?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1604063165585-e17e9b7a9b1b?auto=format&fit=crop&w=1000&q=85",
];

const sampleOwners = [
  { name: "Rahul Sharma", phone: "+91 98••• ••421" },
  { name: "Priya Verma", phone: "+91 97••• ••608" },
  { name: "Aarav Mehta", phone: "+91 99••• ••157" },
  { name: "Neha Kapoor", phone: "+91 96••• ••834" },
  { name: "Kunal Jain", phone: "+91 95••• ••276" },
];

export default function Map({ space }: { space: any }) {
  const router = useRouter();
  const setBookingLocationDetails = useAuthStore((state: any) => state.setBookingLocationDetails);
  const locations = useAuthStore((state: any) => state.displayLocations);
  const [selectedSpotId, setSelectedSpotId] = useState<number | null>(null);

  const position: Coordinates = [Number(space?.latitude) || 23.2599, Number(space?.longitude) || 77.4126];

  // Keep demo listing details stable between renders rather than generating new values on every click.
  const spots = useMemo<ParkingSpot[]>(() => {
    if (!locations) return [];
    return ["position_1", "position_2", "position_3", "position_4", "position_5"]
      .map((key, index) => {
        const location = locations[key];
        if (!location || !Number.isFinite(Number(location.latitude)) || !Number.isFinite(Number(location.longitude))) return null;
        const owner = sampleOwners[index];
        return {
          id: index + 1,
          position: [Number(location.latitude), Number(location.longitude)] as Coordinates,
          owner: owner.name,
          phone: owner.phone,
          price: [80, 120, 95, 150, 110][index],
          size: [180, 400, 250, 320, 220][index],
          available: index !== 2,
          image: parkingImages[index],
          title: ["Secure street-side spot", "Covered private parking", "Compact city parking", "Spacious driveway", "Easy-access parking"][index],
          description: ["Convenient access near local shops.", "Covered space with extra room for SUVs.", "A practical spot for short city visits.", "Private driveway with easy entry.", "Simple parking with quick road access."][index],
        };
      })
      .filter((spot): spot is ParkingSpot => spot !== null);
  }, [locations]);

  const selectedSpot = spots.find((spot) => spot.id === selectedSpotId) ?? null;

  const handleBookingClick = (event: React.MouseEvent<HTMLButtonElement>, spot: ParkingSpot) => {
    event.preventDefault();
    const data = {
      name: spot.title,
      price_per_hour: spot.price,
      availability_status: spot.available,
      latitude: spot.position[0],
      longitude: spot.position[1],
    };
    setBookingLocationDetails(data);
    router.push("/booking");
  };

  return (
    <div className="relative h-[90vh] min-h-[520px] w-full overflow-hidden rounded-2xl">
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={spot.position}
            icon={parkingIcon}
            eventHandlers={{ click: () => setSelectedSpotId(spot.id) }}
          />
        ))}
        <Recenter latitude={position[0]} longitude={position[1]} />
      </MapContainer>

      {selectedSpot && (
        <aside
          key={selectedSpot.id}
          className="absolute right-4 top-4 z-[1000] flex max-h-[calc(100%-2rem)] w-[min(370px,calc(100%-2rem))] flex-col overflow-y-auto rounded-2xl border border-black/10 bg-white shadow-2xl animate-in slide-in-from-right-4 duration-200 sm:right-5 sm:top-5"
          aria-label="Parking spot details"
        >
          <div className="relative h-48 shrink-0 overflow-hidden bg-neutral-100">
            {/* Sample listing photo; replace with the real owner's image when available. */}
            <img
              src={selectedSpot.image}
              alt={`${selectedSpot.title} parking space`}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=1000&q=85";
              }}
            />
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-neutral-900 shadow-sm">
              Sample listing
            </span>
            <button
              type="button"
              onClick={() => setSelectedSpotId(null)}
              aria-label="Close parking details"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-xl text-black shadow-sm transition hover:scale-105 hover:bg-neutral-100"
            >
              ×
            </button>
          </div>

          <div className="space-y-4 p-5">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${selectedSpot.available ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className={`text-xs font-semibold ${selectedSpot.available ? "text-emerald-700" : "text-red-700"}`}>
                  {selectedSpot.available ? "Available now" : "Currently unavailable"}
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-neutral-950">{selectedSpot.title}</h3>
              <p className="mt-1 text-sm leading-5 text-neutral-500">{selectedSpot.description}</p>
            </div>

            <div className="flex items-end justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-3xl font-bold tracking-tight text-neutral-950">₹{selectedSpot.price}</span>
                <span className="ml-1 text-sm text-neutral-500">/ hour</span>
              </div>
              <span className="rounded-lg bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-700">{selectedSpot.size} sq ft</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-neutral-100 text-sm font-bold text-neutral-700">
                {selectedSpot.owner.split(" ").map((part) => part[0]).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-neutral-900">{selectedSpot.owner}</p>
                <p className="mt-0.5 text-sm text-neutral-500">Host · {selectedSpot.phone}</p>
              </div>
              <span className="rounded-full border border-neutral-200 px-2 py-1 text-[11px] font-medium text-neutral-600">Demo</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-neutral-50 p-3">
                <p className="text-xs text-neutral-500">Vehicle fit</p>
                <p className="mt-1 font-semibold text-neutral-900">Car · SUV</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3">
                <p className="text-xs text-neutral-500">Space type</p>
                <p className="mt-1 font-semibold text-neutral-900">{selectedSpot.id === 2 ? "Covered" : "Open-air"}</p>
              </div>
            </div>

            <button
              type="button"
              disabled={!selectedSpot.available}
              onClick={(event) => handleBookingClick(event, selectedSpot)}
              className="w-full rounded-xl bg-black px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[.99] disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {selectedSpot.available ? "Book this spot  →" : "Not available"}
            </button>
            <p className="text-center text-[11px] leading-4 text-neutral-400">
              Demo owner details and prices for UI preview only.
            </p>
          </div>
        </aside>
      )}

      {!selectedSpot && spots.length > 0 && (
        <div className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-xl border border-black/5 bg-white/95 px-4 py-3 shadow-md backdrop-blur-sm">
          <p className="text-sm font-semibold text-neutral-900">Parking around you</p>
          <p className="mt-0.5 text-xs text-neutral-500">Select a black pin to view a space</p>
        </div>
      )}
    </div>
  );
}
