"use client"

import { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from 'leaflet';
import { useRouter } from 'next/navigation';

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

function Routing({sourceCity, destinationCity}: {sourceCity: {latitude:number, longitude:number}, destinationCity: {latitude:number, longitude:number}}){
  const map = useMap()
  const routingControl = L.routing.control({
         waypoints: [
           L.latLng( parseFloat((sourceCity.latitude).toString()), parseFloat((sourceCity.longitude).toString()) ),
           L.latLng( parseFloat((sourceCity.latitude).toString()), parseFloat((sourceCity.longitude).toString()) )
         ],
 }).addTo(map);
    return null
  }

// we are passing an array of locations data from the page.tsx file to this map.tsx file which is fetched in the page.tsx file using an api call and now these location data will be destructured here to display the different markers on the map and inside the popup we will display the details about the location which is also extracted from the location object 
export default function Map({space}: any) {
  const router = useRouter()
  const [marker, setMarker] = useState()
  const [currentSpace, setCurrentSpace] = useState({
    latitude: 5.1243,
    longitude: 0.124
  })
  
  useEffect(() => {
    const response = (localStorage.getItem("auth"))
    if (response) {
      try{
        const data = JSON.parse(response)
        if (data.location) {
          setCurrentSpace({...space, latitude:data.location.latitude, longitude: data.location.longitude})
        }
      }
      catch(error){
        console.log("there is an error while setting the location of the user from local storage");
      }
    }
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    router.push("/booking")
  }

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

      <Marker position={position}>
      <Popup> 
        <div className='bg-blue-700 p-2 text-white rounded-md m-1'>
          price: ${space.price_per_hour}.
        </div> 
        <div className='bg-blue-700 p-2 text-white rounded-md m-1'>
         available: {space.availability_status ? `Yes` : `No`}.
        </div>
        <div>
          <button 
          className='bg-green-500 hover:bg-green-600 p-2 text-white rounded-md m-1'
          onClick={handleClick}
          >book</button>
        </div>
      </Popup>
      </Marker>

      <Recenter latitude={space.latitude} longitude={space.longitude}/>
      
      <Routing sourceCity={currentSpace} destinationCity={space}/>

    </MapContainer>
  );
}