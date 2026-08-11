"use client"

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import MapContainer and friends
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);


export default function Map() {

  useEffect(() => {
    (async () => {
      const L = await import("leaflet"); // runs only in browser
      L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});
    })();
  }, []);

  const position: [number, number] = [28.4098, 77.2790]; // you have to provide the type definition of the position key element
  // use the popup component to show the details about the site with the parking slot
  return (   
    <MapContainer
      key="main-map" 
      center={position} 
      zoom={13} 
      scrollWheelZoom={false}
      style={{height: "70vh", width:"100%", zIndex: 10}}
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
      <Popup> 
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
      </Marker>
    </MapContainer>
  );
}