"use client"

import { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from 'leaflet';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/Auth';

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
export default function Map({space}: any ) {
  const router = useRouter()
  const setBookingLocationDetails = useAuthStore((state) => state.setBookingLocationDetails)
  const locations = useAuthStore((state) => state.displayLocations)
  const [marker, setMarker] = useState()
  const generateRandomNumber = () => {
    return Math.random() * (0.07-0.01) + 0.01
  }

  const generateRandomArea = () => {
    return Math.floor(Math.random() * (400 - 150 + 1)) + 150
  }

  const handleaBookingClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // save the value of the set location inside the zustand authStore and then redirect the user to the booking page and then extract those latitude and longitude from the zustand store and after the booking and the payment redirect the user to the google maps api 
    e.preventDefault()
    const latitude  = space.latitude
    const longitude = space.longitude
    const name = space.name
    const price_per_hour = space.price_per_hour
    const availability_status = space.availability_status
    const data = {name, price_per_hour, availability_status, latitude, longitude}    
    setBookingLocationDetails(data)
    router.push("/booking")
  }

  const position: [number, number] = [space.latitude, space.longitude]; // you have to provide the type definition of the position key element  
  const position_1: [number, number] = [locations!.position_1.latitude, locations!.position_1.longitude ]
  const position_2: [number, number] = [locations!.position_2.latitude, locations!.position_2.longitude ]
  const position_3: [number, number] = [locations!.position_3.latitude, locations!.position_3.longitude ]
  const position_4: [number, number] = [locations!.position_4.latitude, locations!.position_4.longitude ]
  const position_5: [number, number] = [locations!.position_5.latitude, locations!.position_5.longitude ]

  // use the popup component to show the details about the site with the parking slot
  return (   
    <MapContainer
      key={process.env.NODE_ENV === "development" ? Date.now() : "main-map"} 
      center={position} 
      zoom={13} 
      scrollWheelZoom={false}
      style={{height: "90vh", width:"100%", zIndex: 10}}
      >

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position_1} >
      <Popup> 
        <div className='flex w-44 items-center justify-between rounded-lg bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] px-3 py-2 text-white shadow-sm m-1'>
          <span className='text-xs uppercase tracking-wide text-white/80'>Price</span>
          <span className='text-sm font-semibold'>${(generateRandomNumber()*1000).toFixed(2)}</span>
        </div> 
        <div className='flex w-44 items-center justify-between rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-2 text-[#0F172A] m-1'>
          <span className='text-xs uppercase tracking-wide text-[#64748B]'>Size</span>
          <span className='text-sm font-semibold'>{generateRandomArea()} sq ft</span>
        </div>
        <div className={`flex w-44 items-center justify-between rounded-lg border px-3 py-2 m-1 ${space.availability_status ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]' : 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'}`}>
          <span className='text-xs uppercase tracking-wide opacity-80'>Available</span>
          <span className='text-sm font-semibold'>{space.availability_status ? `Yes` : `No`}</span>
        </div>
        <div className='w-44 m-1'>
          <button 
          className='w-full cursor-pointer rounded-lg bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] px-3 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[linear-gradient(135deg,#1E40AF_0%,#06A3C7_100%)] hover:opacity-95'
          onClick={handleaBookingClick}
          >book</button>
        </div>
      </Popup>
      </Marker>

      <Marker position={position_2} >
      <Popup> 
        <div className='flex w-44 items-center justify-between rounded-lg bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] px-3 py-2 text-white shadow-sm m-1'>
          <span className='text-xs uppercase tracking-wide text-white/80'>Price</span>
          <span className='text-sm font-semibold'>${(generateRandomNumber()*1000).toFixed(2)}</span>
        </div> 
        <div className='flex w-44 items-center justify-between rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-2 text-[#0F172A] m-1'>
          <span className='text-xs uppercase tracking-wide text-[#64748B]'>Size</span>
          <span className='text-sm font-semibold'>{generateRandomArea()} sq ft</span>
        </div>
        <div className={`flex w-44 items-center justify-between rounded-lg border px-3 py-2 m-1 ${space.availability_status ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]' : 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'}`}>
          <span className='text-xs uppercase tracking-wide opacity-80'>Available</span>
          <span className='text-sm font-semibold'>{space.availability_status ? `Yes` : `No`}</span>
        </div>
        <div className='w-44 m-1'>
          <button 
          className='w-full cursor-pointer rounded-lg bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] px-3 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[linear-gradient(135deg,#1E40AF_0%,#06A3C7_100%)] hover:opacity-95'
          onClick={handleaBookingClick}
          >book</button>
        </div>
      </Popup>
      </Marker>

      <Marker position={position_3} >
      <Popup> 
        <div className='flex w-44 items-center justify-between rounded-lg bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] px-3 py-2 text-white shadow-sm m-1'>
          <span className='text-xs uppercase tracking-wide text-white/80'>Price</span>
          <span className='text-sm font-semibold'>${(generateRandomNumber()*1000).toFixed(2)}</span>
        </div> 
        <div className='flex w-44 items-center justify-between rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-2 text-[#0F172A] m-1'>
          <span className='text-xs uppercase tracking-wide text-[#64748B]'>Size</span>
          <span className='text-sm font-semibold'>{generateRandomArea()} sq ft</span>
        </div>
        <div className={`flex w-44 items-center justify-between rounded-lg border px-3 py-2 m-1 ${space.availability_status ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]' : 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'}`}>
          <span className='text-xs uppercase tracking-wide opacity-80'>Available</span>
          <span className='text-sm font-semibold'>{space.availability_status ? `Yes` : `No`}</span>
        </div>
        <div className='w-44 m-1'>
          <button 
          className='w-full cursor-pointer rounded-lg bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] px-3 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[linear-gradient(135deg,#1E40AF_0%,#06A3C7_100%)] hover:opacity-95'
          onClick={handleaBookingClick}
          >book</button>
        </div>
      </Popup>
      </Marker>

      <Marker position={position_4} >
      <Popup> 
        <div className='flex w-44 items-center justify-between rounded-lg bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] px-3 py-2 text-white shadow-sm m-1'>
          <span className='text-xs uppercase tracking-wide text-white/80'>Price</span>
          <span className='text-sm font-semibold'>${(generateRandomNumber()*1000).toFixed(2)}</span>
        </div> 
        <div className='flex w-44 items-center justify-between rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-2 text-[#0F172A] m-1'>
          <span className='text-xs uppercase tracking-wide text-[#64748B]'>Size</span>
          <span className='text-sm font-semibold'>{generateRandomArea()} sq ft</span>
        </div>
        <div className={`flex w-44 items-center justify-between rounded-lg border px-3 py-2 m-1 ${space.availability_status ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]' : 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'}`}>
          <span className='text-xs uppercase tracking-wide opacity-80'>Available</span>
          <span className='text-sm font-semibold'>{space.availability_status ? `Yes` : `No`}</span>
        </div>
        <div className='w-44 m-1'>
          <button 
          className='w-full cursor-pointer rounded-lg bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] px-3 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[linear-gradient(135deg,#1E40AF_0%,#06A3C7_100%)] hover:opacity-95'
          onClick={handleaBookingClick}
          >book</button>
        </div>
      </Popup>
      </Marker>

      <Marker position={position_5} >
      <Popup> 
        <div className='flex w-44 items-center justify-between rounded-lg bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] px-3 py-2 text-white shadow-sm m-1'>
          <span className='text-xs uppercase tracking-wide text-white/80'>Price</span>
          <span className='text-sm font-semibold'>${(generateRandomNumber()*1000).toFixed(2)}</span>
        </div> 
        <div className='flex w-44 items-center justify-between rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-2 text-[#0F172A] m-1'>
          <span className='text-xs uppercase tracking-wide text-[#64748B]'>Size</span>
          <span className='text-sm font-semibold'>{generateRandomArea()} sq ft</span>
        </div>
        <div className={`flex w-44 items-center justify-between rounded-lg border px-3 py-2 m-1 ${space.availability_status ? 'border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]' : 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'}`}>
          <span className='text-xs uppercase tracking-wide opacity-80'>Available</span>
          <span className='text-sm font-semibold'>{space.availability_status ? `Yes` : `No`}</span>
        </div>
        <div className='w-44 m-1'>
          <button 
          className='w-full cursor-pointer rounded-lg bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] px-3 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[linear-gradient(135deg,#1E40AF_0%,#06A3C7_100%)] hover:opacity-95'
          onClick={handleaBookingClick}
          >book</button>
        </div>
      </Popup>
      </Marker>

      <Recenter latitude={space.latitude} longitude={space.longitude}/>
      
    </MapContainer>
  );

}