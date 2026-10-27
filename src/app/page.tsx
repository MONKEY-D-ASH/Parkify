"use client"
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from "axios"
import { useAuthStore } from '@/store/Auth';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// the loading = 'eager' is to load the image instantly at the time of page render
const Map = dynamic(() => import("./map"), { ssr: false });

interface LocationDetails {
  price_per_hour : number;
  availability_status: boolean;
  latitude: number;
  longitude: number;
  name: string
}

export default function HomePage() {
  const setCurrentLocation = useAuthStore((state) => state.setCurrentLocation)
  const resetStore = useAuthStore((state) => state.resetStore)
  const setDisplayLocations = useAuthStore((state) => state.setDisplayLocations)
  const user = useAuthStore((state) => state.user)
  const router = useRouter()
  const [showpanel, setShowpanel] = useState(false)
  const [searchtext, setSearchtext] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showOptions, setShowOptions] = useState(true)

  const generateRandomNumber = () => {
    return Math.random() * (0.03-0.01) + 0.01
  }
  const [space, setSpace] = useState<LocationDetails>({
    price_per_hour: Number((generateRandomNumber()*1000).toFixed(2)),
    availability_status: false,
    latitude: 48.8566,
    longitude: 2.3522,
    name: "your location"
    
  })

  const handleClick = () => {
    setShowpanel(!showpanel);
    // profile option - if the user is a customer then show become a provider and if the user is a provider show provider dashboard
  }

  const handleLogoutClick = async(e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    try {
      const response = await axios.get("./api/logout")
      if (response.data.success) {
        resetStore()
        toast.success("Logout success")
        router.push("/")
      }
      setShowOptions(false)
    } catch (error: any) {
      console.log("There is an error in logout", error!.message);
      toast.error("Logout failed")
    }
  }

  const handleSearch = async() => {
    // this will make an api call using the text that is provided inside the search box and that api will make a database call and search for the parking space near the entered location and will return the latitude and longitude of those locations which will be rendered on the map  
    if (searchtext.length != 0) {
          try {
            setIsLoading(true)
            const data = searchtext.trim().toLowerCase().toString()
            const response = await axios.post("/api/search", {data})
            const {latitude, longitude, name} = response.data.data
            setSpace({
              price_per_hour: 50,
              availability_status: true,
              latitude: Number(latitude),
              longitude: Number(longitude),
              name:name,
            })
          const displayLocations = {
            position_1: {latitude: space.latitude + generateRandomNumber(), longitude: space.longitude + generateRandomNumber()},
            position_2: {latitude: space.latitude + generateRandomNumber(), longitude: space.longitude + generateRandomNumber()},
            position_3: {latitude: space.latitude + generateRandomNumber(), longitude: space.longitude + generateRandomNumber()},
            position_4: {latitude: space.latitude + generateRandomNumber(), longitude: space.longitude + generateRandomNumber()},
            position_5: {latitude: space.latitude + generateRandomNumber(), longitude: space.longitude + generateRandomNumber()},
          }
            setDisplayLocations(displayLocations)

          } catch (error: any) {
            console.log(error);
            console.log("search failed", error?.message);
          }
          finally{
            setIsLoading(false)
          }
    }
  }

  // this useEffect will fetch the details of the user from the zustand store and will display it on the popup profile section like user photo, name and email 
  useEffect(() => {
    if (user === null) {
        setShowOptions(true)
    }else {
      setShowOptions(false)
    }
  })

  useEffect(() => {
    // on loading the main webpage , grab the users current location and then save it inside the local storage of the browser and on clicking the book option save the booking  location also in the local storage and during confirm booking take those two locations and redirect the user to the google maps website and hit direction
    const displayLocations = {
            position_1: {latitude: space.latitude + generateRandomNumber(), longitude: space.longitude + generateRandomNumber()},
            position_2: {latitude: space.latitude + generateRandomNumber(), longitude: space.longitude + generateRandomNumber()},
            position_3: {latitude: space.latitude + generateRandomNumber(), longitude: space.longitude + generateRandomNumber()},
            position_4: {latitude: space.latitude + generateRandomNumber(), longitude: space.longitude + generateRandomNumber()},
            position_5: {latitude: space.latitude + generateRandomNumber(), longitude: space.longitude + generateRandomNumber()},
          }
          setDisplayLocations(displayLocations)
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
  <div className='min-h-screen bg-[#F8FAFC]'> 
    {showpanel && (
      <div className='absolute top-18 left-3 w-72 rounded-xl bg-white z-50 overflow-hidden border border-[#E2E8F0] shadow-[0_8px_24px_rgba(30,58,138,0.15)]'
      id='side-panel'
      >
        <div id='profile-photo-container' className='flex flex-col justify-center items-center gap-1 py-6 bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] text-white'>
          <div id='profile-picture' className='flex justify-center items-center bg-white h-20 w-20 rounded-full ring-4 ring-white/30 shadow-md mb-2'>
            <h1 className='text-4xl font-semibold text-[#1E3A8A]'>{user? user.username.charAt(0).toUpperCase() : ""}</h1>
          </div>
          <p className='text-base font-semibold'>{user? user.username : ""}</p>
          <p className='text-sm text-white/80'>{user? user.email : ""}</p>
        </div>

        <div className='flex justify-center items-center bg-white h-12 text-[#0F172A] text-sm font-medium border-b border-[#E2E8F0] transition-colors hover:bg-[#ECFEFF] hover:text-[#0891B2]'>
          <Link href="./profile" className='flex w-full h-full items-center justify-center'>Profile</Link>
        </div>

        {/* <div className='flex justify-center items-center bg-white h-12 text-[#0F172A] text-sm font-medium border-b border-[#E2E8F0] transition-colors hover:bg-[#ECFEFF] hover:text-[#0891B2]'>
          <Link href="./update_profile" className='flex w-full h-full items-center justify-center'>Update Profile</Link>
        </div> */}

        <div className='flex justify-center items-center bg-white h-12 text-[#EF4444] text-sm font-medium transition-colors hover:bg-red-50'> 
          <Link href="./logout"
          onClick={handleLogoutClick}
          className='flex w-full h-full items-center justify-center'
          >Logout</Link>
        </div>

      </div>
    )}

    <div id='navbar-div' className='relative flex items-center justify-center h-16 px-3 bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] text-[#0F172A] shadow-[0_4px_16px_rgba(30,58,138,0.25)]'>

      <div id='outer-list-icon-div' className='absolute left-3 flex items-center justify-center w-10 h-10 bg-white/95 rounded-lg shadow-sm cursor-pointer transition hover:bg-white hover:scale-105'>
          <div className='p-2'>
            <Image
          src="/images/list_icon_image.png"
          loading='eager'
          width={500}
          height={500}
          alt='list'
          onClick={handleClick}
          className='cursor-pointer'
           />
          </div>
      </div>

      <div id='search-bar-div' className='flex w-full max-w-xl mx-14 shadow-md rounded-lg overflow-hidden'> 
        <input className='flex-1 min-w-0 h-10 bg-white px-4 text-sm text-[#0F172A] placeholder:text-[#64748B] outline-none focus:ring-2 focus:ring-inset focus:ring-[#67E8F9]'
        type="text" 
        placeholder='enter your destination' 
        value= {searchtext}
        onChange={(e) => setSearchtext(e.target.value)}
        />

        <input className='h-10 px-5 bg-[#67E8F9] text-[#1E3A8A] text-sm font-semibold capitalize cursor-pointer transition-colors hover:bg-[#22D3EE]' 
          type="button" 
          value="search"
          onClick={handleSearch}
        />
      </div>
      
      {showOptions && (
      <div className='absolute right-3 flex items-center gap-2'>
        <div className='px-4 py-2 rounded-lg text-sm font-medium text-white border border-white/40 transition-colors hover:bg-white/15'>
          <Link href="./login">Login</Link>
        </div>

        <div className='px-4 py-2 rounded-lg text-sm font-semibold bg-white text-[#1E3A8A] shadow-sm transition-colors hover:bg-[#ECFEFF]'>
          <Link href="./registerUser">Register</Link>
        </div>
      </div>
      )}

    </div>
    <Map space={space}/>

    {/* How it works */}
    <section className='max-w-5xl mx-auto px-4 py-12'>
      <h2 className='text-2xl font-semibold text-center text-[#1E3A8A] mb-8'>How it works</h2>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>

        <div className='bg-white rounded-xl border border-[#E2E8F0] p-6 text-center shadow-sm transition hover:shadow-[0_8px_24px_rgba(30,58,138,0.15)]'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] text-lg font-semibold text-white'>1</div>
          <h3 className='text-lg font-semibold text-[#0F172A] mb-1'>Search</h3>
          <p className='text-sm text-[#64748B]'>Enter your destination and see nearby parking spaces on the map.</p>
        </div>

        <div className='bg-white rounded-xl border border-[#E2E8F0] p-6 text-center shadow-sm transition hover:shadow-[0_8px_24px_rgba(30,58,138,0.15)]'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] text-lg font-semibold text-white'>2</div>
          <h3 className='text-lg font-semibold text-[#0F172A] mb-1'>Book</h3>
          <p className='text-sm text-[#64748B]'>Choose a space, set your arrival and departure time, and confirm.</p>
        </div>

        <div className='bg-white rounded-xl border border-[#E2E8F0] p-6 text-center shadow-sm transition hover:shadow-[0_8px_24px_rgba(30,58,138,0.15)]'>
          <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] text-lg font-semibold text-white'>3</div>
          <h3 className='text-lg font-semibold text-[#0F172A] mb-1'>Park</h3>
          <p className='text-sm text-[#64748B]'>Get directions to your booked space and park without the hassle.</p>
        </div>

      </div>
    </section>

    {/* Become a provider banner */}
    <section className='max-w-5xl mx-auto px-4 pb-12'>
      <div className='flex flex-col items-center gap-4 rounded-2xl bg-[linear-gradient(135deg,#1E3A8A_0%,#0891B2_100%)] px-6 py-10 text-center shadow-[0_8px_24px_rgba(30,58,138,0.25)]'>
        <h2 className='text-2xl font-semibold text-white'>Have a spare parking space?</h2>
        <p className='max-w-md text-sm text-white/80'>List it on our platform and earn money whenever someone books it.</p>
        <Link href="./becomeProvider" className='rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-[#1E3A8A] shadow-sm transition-colors hover:bg-[#ECFEFF]'>
          Become a provider
        </Link>
      </div>
    </section>

    {/* Footer */}
    <footer className='bg-[#0F172A] px-4 py-6 text-center text-sm text-[#94A3B8]'>
      <div className='mb-2 flex justify-center gap-5'>
        <Link href="/" className='transition-colors hover:text-[#67E8F9]'>Home</Link>
        <Link href="./login" className='transition-colors hover:text-[#67E8F9]'>Login</Link>
        <Link href="./registerUser" className='transition-colors hover:text-[#67E8F9]'>Register</Link>
      </div>
      <p>© 2026 Parkify. College project.</p>
    </footer>
  </div>
  );
}   