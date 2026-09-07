"use client"

import { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function Recenter({latitude, longitude}: {latitude: number, longitude: number}){
  const map = useMap()

  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom())
  },[latitude, longitude, map])

  return null
}

// we are passing an array of locations data from the page.tsx file to this map.tsx file which is fetched in the page.tsx file using an api call and now these location data will be destructured here to display the different markers on the map and inside the popup we will display the details about the location which is also extracted from the location object 
export default function Map({space}: any) {
  const [marker, setMarker] = useState()

  const position: [number, number] = [space.latitude, space.longitude]; // you have to provide the type definition of the position key element
  // use the popup component to show the details about the site with the parking slot
  return (   
    <MapContainer
      key={process.env.NODE_ENV === "development" ? Date.now() : "main-map"} 
      center={position} 
      zoom={13} 
      scrollWheelZoom={false}
      style={{height: "70vh", width:"100%", zIndex: 10}}
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} >
      <Popup> 
        price: ${space.price_per_hour}. <br /> available: {space.availability_status && `true`}.
      </Popup>
      </Marker>
      <Recenter latitude={space.latitude} longitude={space.longitude}/>
    </MapContainer>
  );
}