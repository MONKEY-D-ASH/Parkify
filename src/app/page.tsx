"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownRight, ArrowRight, CarFront, Clock3, Compass, LocateFixed, MapPin, Menu, Search, ShieldCheck, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { useAuthStore } from "@/store/Auth";
import toast from "react-hot-toast";

const Map = dynamic(() => import("./map"), { ssr: false });

interface LocationDetails {
  price_per_hour: number;
  availability_status: boolean;
  latitude: number;
  longitude: number;
  name: string;
}

export default function HomePage() {
  const setCurrentLocation = useAuthStore((state) => state.setCurrentLocation);
  const resetStore = useAuthStore((state) => state.resetStore);
  const setDisplayLocations = useAuthStore((state) => state.setDisplayLocations);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const [showPanel, setShowPanel] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [space, setSpace] = useState<LocationDetails>({
    price_per_hour: 50,
    availability_status: false,
    latitude: 23.2599,
    longitude: 77.4126,
    name: "Bhopal, India",
  });

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      const response = await axios.get("/api/logout");
      if (response.data.success) {
        resetStore();
        toast.success("Logged out successfully");
        router.push("/");
      }
      setShowPanel(false);
    } catch (error: any) {
      console.error("Logout failed", error?.message);
      toast.error("Logout failed");
    }
  };

  const handleSearch = async () => {
    const query = searchText.trim();
    if (!query) {
      toast.error("Enter a destination to search");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("/api/search", { data: query.toLowerCase() });
      const { latitude, longitude, name } = response.data.data;
      const lat = Number(latitude);
      const lng = Number(longitude);

      setSpace({
        price_per_hour: 50,
        availability_status: true,
        latitude: lat,
        longitude: lng,
        name: name || query,
      });

      // Nearby pins are illustrative until real parking-space records are returned by the API.
      setDisplayLocations({
        position_1: { latitude: lat + 0.012, longitude: lng + 0.009 },
        position_2: { latitude: lat - 0.009, longitude: lng + 0.014 },
        position_3: { latitude: lat + 0.006, longitude: lng - 0.012 },
        position_4: { latitude: lat - 0.014, longitude: lng - 0.007 },
        position_5: { latitude: lat + 0.016, longitude: lng - 0.015 },
      });
    } catch (error: any) {
      console.error("Search failed", error);
      toast.error("We couldn't find that destination. Try another search.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) return;

    const alreadyMounted = localStorage.getItem("currentLocMounted");
    if (alreadyMounted === "true") return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.info("Location permission not available", error.message),
      { timeout: 8000, maximumAge: 60000 }
    );
  }, [setCurrentLocation]);

  return (
    <main className="parkify-page min-h-screen bg-white text-neutral-950">
      <header className="parkify-topbar">
        <div className="parkify-nav-inner">
          <Link href="/" className="parkify-wordmark" aria-label="Parkify home">parkify<span>.</span></Link>
          <nav className="hidden items-center gap-2 md:flex" aria-label="Main navigation">
            <Link className="nav-pill nav-pill-active" href="/">Find parking</Link>
            <a className="nav-pill" href="#how-it-works">How it works</a>
            <a className="nav-pill" href="#for-providers">For providers</a>
            <Link className="nav-pill" href="/dashboard">Business</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="nav-help hidden sm:inline-flex">Demo dashboard</Link>
            {user ? (
              <button className="nav-account" onClick={() => setShowPanel((value) => !value)}>
                <span className="account-avatar">{user.username?.charAt(0)?.toUpperCase() || "U"}</span>
                <span className="hidden sm:inline">{user.username || "Account"}</span>
              </button>
            ) : (
              <>
                <Link href="/login" className="nav-help hidden sm:inline-flex">Log in</Link>
                <Link href="/registerUser" className="nav-signup">Sign up</Link>
              </>
            )}
            <button className="mobile-menu md:hidden" onClick={() => setShowPanel((value) => !value)} aria-label="Open account menu">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {showPanel && (
        <div className="account-popover">
          <div className="account-popover-head">
            <div className="account-avatar account-avatar-large">{user?.username?.charAt(0)?.toUpperCase() || "U"}</div>
            <div>
              <p className="font-semibold">{user?.username || "Welcome to Parkify"}</p>
              <p className="text-sm text-neutral-500">{user?.email || "Sign in to manage your bookings"}</p>
            </div>
            <button onClick={() => setShowPanel(false)} aria-label="Close menu"><X size={18} /></button>
          </div>
          {user ? (
            <>
              <Link href="/profile" className="popover-link">Your profile <ArrowRight size={16} /></Link>
              <Link href="/dashboard" className="popover-link">Business dashboard <ArrowRight size={16} /></Link>
              <Link href="/logout" onClick={handleLogout} className="popover-link popover-logout">Log out</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="popover-link">Log in <ArrowRight size={16} /></Link>
              <Link href="/registerUser" className="popover-link">Create an account <ArrowRight size={16} /></Link>
            </>
          )}
        </div>
      )}

      <section className="parkify-subnav">
        <div className="parkify-subnav-inner">
          <span className="subnav-title">Parking</span>
          <div className="subnav-links">
            <a href="#find-parking">Find a space</a>
            <a href="#how-it-works">How it works</a>
            <a href="#for-providers">List your space</a>
          </div>
        </div>
      </section>

      <section id="find-parking" className="parking-hero">
        <div className="booking-column">
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR CITY, YOUR SPACE</div>
          <h1>Parking made<br /><span>simple.</span></h1>
          <p className="hero-copy">Find a spot that fits your plans. Spend less time circling and more time getting where you need to be.</p>

          <div className="city-line"><MapPin size={17} fill="currentColor" /><span>{space.name || "Bhopal, India"}</span><span className="city-separator">·</span><button onClick={() => setSearchText("Bhopal, India")}>Change destination</button></div>

          <div className="booking-card">
            <div className="booking-card-heading">
              <div>
                <span className="section-kicker">LET'S GET YOU PARKED</span>
                <h2>Where are you going?</h2>
              </div>
              <div className="booking-icon"><CarFront size={23} /></div>
            </div>
            <form className="destination-form" onSubmit={(e) => { e.preventDefault(); void handleSearch(); }}>
              <label className="destination-input-wrap">
                <span className="route-marker route-marker-start"><MapPin size={17} fill="currentColor" /></span>
                <span className="destination-input-content">
                  <span className="input-label">Destination</span>
                  <input value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Enter an address or place" />
                </span>
                <button type="button" className="locate-button" title="Use current location" onClick={() => {
                  if (!navigator.geolocation) return toast.error("Location isn't supported by this browser");
                  navigator.geolocation.getCurrentPosition((position) => {
                    setCurrentLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
                    toast.success("Current location updated");
                  }, () => toast.error("Allow location access to use this feature"));
                }}><LocateFixed size={19} /></button>
              </label>
              <div className="booking-divider" />
              <div className="booking-meta-row">
                <span className="route-marker route-marker-end"><Clock3 size={16} /></span>
                <div><span className="input-label">Arrival</span><span className="input-value">Today · Arriving now</span></div>
                <span className="meta-chevron">⌄</span>
              </div>
              <button className="search-spaces-button" type="submit" disabled={isLoading}>
                {isLoading ? <span className="loading-dot" /> : <Search size={18} />}
                {isLoading ? "Searching..." : "Find parking"}
                {!isLoading && <ArrowRight size={18} />}
              </button>
              <p className="form-footnote"><ShieldCheck size={14} /> Clear options. No guesswork.</p>
            </form>
          </div>

          <div className="trust-row">
            <div className="trust-item"><span className="trust-icon"><Compass size={17} /></span><span><strong>Easy to find</strong><small>Search by destination</small></span></div>
            <div className="trust-item"><span className="trust-icon"><Clock3 size={17} /></span><span><strong>Save your time</strong><small>Plan before you arrive</small></span></div>
          </div>
        </div>

        <div className="map-column">
          <div className="map-heading">
            <div><span className="section-kicker">LIVE DISCOVERY</span><h2>Parking around you</h2></div>
            <button className="filter-button" onClick={() => toast("Search for a destination to explore nearby map points.")}><SlidersHorizontal size={16} /> Filters</button>
          </div>
          <div className="map-frame">
            <Map space={space} />
            <div className="map-floating-label"><span className="map-status-dot" /><span><strong>Explore the area</strong><small>Map preview</small></span></div>
            <div className="map-credit">Map data © OpenStreetMap contributors</div>
          </div>
          <div className="map-bottom-row">
            <div className="map-bottom-icon"><Sparkles size={17} /></div>
            <div><strong>Your next spot is closer than you think.</strong><p>Search a destination to update the map.</p></div>
            <ArrowDownRight size={19} className="text-neutral-400" />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-section">
        <div className="section-heading-row"><div><span className="section-kicker">MADE FOR THE WAY YOU MOVE</span><h2>Good parking changes everything.</h2></div><p>Three simple steps from searching to settling in.</p></div>
        <div className="steps-grid">
          <article className="step-card"><span className="step-number">01</span><div className="step-symbol"><Search size={22} /></div><h3>Find your spot</h3><p>Search the place you're headed and explore the area on the map.</p><span className="step-link">Start exploring <ArrowRight size={15} /></span></article>
          <article className="step-card"><span className="step-number">02</span><div className="step-symbol"><Clock3 size={22} /></div><h3>Plan your arrival</h3><p>Review parking options and plan your trip before you set off.</p><span className="step-link">Make a plan <ArrowRight size={15} /></span></article>
          <article className="step-card"><span className="step-number">03</span><div className="step-symbol"><CarFront size={22} /></div><h3>Park with ease</h3><p>Keep your destination handy and get on with the rest of your day.</p><span className="step-link">Get moving <ArrowRight size={15} /></span></article>
        </div>
      </section>

      <section id="for-providers" className="provider-banner">
        <div className="provider-orb provider-orb-one" /><div className="provider-orb provider-orb-two" />
        <div className="provider-banner-copy"><span className="section-kicker section-kicker-light">FOR SPACE OWNERS</span><h2>An empty space<br />is an opportunity.</h2><p>Make your unused parking space work harder. Join Parkify and help drivers find a better place to park.</p><Link href="/becomeProvider" className="provider-cta">List your space <ArrowRight size={17} /></Link></div>
        <div className="provider-visual" aria-hidden="true"><div className="visual-ring visual-ring-one" /><div className="visual-ring visual-ring-two" /><div className="visual-car"><CarFront size={100} strokeWidth={1.15} /></div><div className="visual-stat"><span className="visual-stat-dot" /><span><strong>Your space, seen.</strong><small>Ready for its next driver</small></span></div><div className="visual-pin"><MapPin size={23} fill="currentColor" /></div></div>
      </section>

      <footer className="parkify-footer"><Link href="/" className="parkify-wordmark footer-wordmark">parkify<span>.</span></Link><p>Better parking starts here.</p><div className="footer-links"><Link href="/">Find parking</Link><Link href="/dashboard">Business demo</Link><Link href="/login">Log in</Link><Link href="/registerUser">Sign up</Link></div><span className="footer-copyright">© 2026 Parkify · Student project demo</span></footer>
    </main>
  );
}
