"use client"
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from "axios"
import { useAuthStore } from '@/store/Auth';
import toast from 'react-hot-toast';

// the loading = 'eager' is to load the image instantly at the time of page render
const Map = dynamic(() => import("./map"), { ssr: false });

export default function Home() {
  const {setCurrentLocation} = useAuthStore()
  const [showpanel, setShowpanel] = useState(false)
  const [searchtext, setSearchtext] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [space, setSpace] = useState({
    price_per_hour: 0,
    availability_status: false,
    latitude: 48.8566,
    longitude: 2.3522
  })

  const handleClick = () => {
    setShowpanel(!showpanel);
    // profile option - if the user is a customer then show become a provider and if the user is a provider show provider dashboard
  }

  const handleLogoutClick = async(e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    // const response = await logout()
    // if (response.error) {
    //   toast.error(response.error!.message)
    // }else{
    //   toast.success("logout success")
    // }
  }

  const handleSearch = async() => {
    // this will make an api call using the text that is provided inside the search box and that api will make a database call and search for the parking space near the entered location and will return the latitude and longitude of those locations which will be rendered on the map  
    if (searchtext.length != 0) {
          try {
            setIsLoading(true)
            const data = searchtext.trim().toLowerCase().toString()
            const response = await axios.post("/api/search", {data})
            
            const {latitude, longitude} = response.data.data
            
            setSpace({
              price_per_hour: 50,
              availability_status: true,
              latitude: Number(latitude),
              longitude: Number(longitude)
            })

          } catch (error: any) {
            console.log(error);
            console.log("search failed", error?.message);
          }
          finally{
            setIsLoading(false)
          }
    }
  }


  useEffect(() => {
    // on loading the main webpage , grab the users current location and then save it inside the local storage of the browser and on clicking the book option save the booking  location also in the local storage and during confirm booking take those two locations and redirect the user to the google maps website and hit direction
     if (!navigator.geolocation) {
            console.log("Geolocation is not supported by your browser");
            return;
        }
      const flag = localStorage.getItem("currentLocMounted")      
      if (flag === "true") {
        return;
      }
    
        // requesting the current location of the user 
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
    
            const data = {latitude, longitude}
            setCurrentLocation(data)
            // localStorage.setItem("currentLocation", JSON.stringify(data))
            // localStorage.setItem("currentLocMounted", "true")
        }),
        
        (error: any) => {
            console.log(error);
        }
    
    window.onerror = () => {
      // reload once after an error
      if (!sessionStorage.getItem("errorReloaded")) {
        sessionStorage.setItem("errorReloaded", "true");
        window.location.reload();
      }
      return false; // prevent default error handling
    };
  }, []);

  return (
  <div> 
    {showpanel && (
      <div className='absolute top-14 left-3 w-70 h-70 rounded-lg bg-red-500 z-50'
      id='side-panel'
      >
        <div id='profile-photo-container' className='flex justify-center items-center rounded-t-lg h-30 bg-gray-100 border-b border-gray-400'>
          <div id='profile-picture' className='bg-white h-23 w-23 border rounded-full border-black'>
            <Image
            src="/images/list_icon_image.png" // the profile picture of the user will be displayed here 
            loading='eager'
            width={510}
            height={510}
            alt='list'
            />
          </div>
        </div>

        <div className='flex justify-center items-center bg-gray-100 h-10 text-black border-b border-gray-400 hover:bg-gray-200'>
          <Link href="./profile">Profile</Link>
        </div>

        <div className='flex justify-center items-center bg-gray-100 h-10 text-black border-b border-gray-400 hover:bg-gray-200'>
          <Link href="./dashboard">Become provider/Dashboard</Link>
        </div>

        <div className='flex justify-center items-center bg-gray-100 h-10 text-black border-b border-gray-400 hover:bg-gray-200'>
          <Link href="./update_profile">Update Profile</Link>
        </div>

        <div className='flex justify-center items-center bg-gray-100 h-10 text-black hover:bg-gray-200 rounded-b-lg'> 
          <Link href="./logout"
          onClick={handleLogoutClick}
          >Logout</Link>
        </div>
        
      </div>
    )}

    <div id='navbar-div' className='relative flex justify-center w-100% h-17 bg-gray-800 text-black '>

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

      <div id='search-bar-div' className='flex bg-gray-800 w-100'> 
        <input className='bg-white my-3 w-90 ml-1 pl-2 rounded-bl-md rounded-tl-md'
        type="text" 
        placeholder='enter your text here' 
        value= {searchtext}
        onChange={(e) => setSearchtext(e.target.value)}
        />

        <input className='bg-green-500 hover:bg-green-600 my-3 mr-1 rounded-tr-md rounded-br-md px-2' 
          type="button" 
          value="search"
          onClick={handleSearch}
        />
      </div>
      
      <div className='absolute right-20 top-5 bg-white px-2 py-1 mx-4 rounded-md hover:bg-gray-200'>
        <Link href="./login">Login</Link>
      </div>

      <div className='absolute right-5 top-5 bg-white px-2 py-1 rounded-md hover:bg-gray-200'>
        <Link href="./signup">Sign up</Link>
      </div>

    </div>
    <Map space={space}/>   
  </div>
  );
}