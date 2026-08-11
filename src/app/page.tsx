"use client"

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { useState } from 'react';

// the loading = 'eager' is to load the image instantly at the time of page render

const Map = dynamic(() => import("./map"),{ ssr:false})

export default function Home() {
  const [showpanel, setShowpanel] = useState(false)

  const handleClick = () => {
    setShowpanel(!showpanel);
    // open the side panel (in this handleClick event use a const )
    // which will have the following options 
    // profile pic
    // profile option - if the user is a customer then show become a provider and if the user is a provider show provider dashboard
    // logout  
    // update details 
  }

  const handleSearch = () => {
    // this will make an api call and that api will make a database call and search for the parking space near the entered location and will return the latitude and longitude of those locations which will be showed on the map  
  }

  return (
  <div> 
    {showpanel && (
      <div className='absolute top-13 left-3 w-70 h-70 rounded-lg bg-red-500 z-50'
      id='side-panel'
      >
        <div className='flex justify-end rounded-t-lg bg-green-500'>
        </div>
      </div>
    )}

    <div id='navbar-div' className='relative flex justify-center w-100% h-17 bg-white text-black '>

      <div id='outer-list-icon-div' className='absolute left-0 w-10 h-10 bg-white m-3 rounded-md'>
          <div className='p-1'>
            <Image
          src="/images/list_icon_image.png"
          loading='eager'
          width={500}
          height={500}
          alt='list'
          onClick={handleClick}
           />
          </div>
      </div>

      <div id='search-bar-div' className='flex bg-blue-500 w-100'> 
        <input className='bg-white my-3 w-90 ml-1 pl-2 rounded-bl-md rounded-tl-md'  type="text" placeholder='enter your text here' />
        <input className='bg-green-500 hover:bg-green-600 my-3 mr-1 rounded-tr-md rounded-br-md px-2' 
          type="button" 
          value="search"
          onClick={(e) => {
            e.preventDefault();
            handleSearch()
          }}
        />
      </div>
      
    </div>
    <Map />   
  </div>
  );
}