"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/Auth";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CarFront,
  CheckCircle2,
  LayoutDashboard,
  MapPin,
  ParkingSquare,
  TrendingUp,
  UserRound,
  Wallet,
  XCircle,
} from "lucide-react";

interface BookingData {
  _id: string;
  address: string;
  price_per_hour: number;
  latitude: number;
  longitude: number;
  status: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
}

const demoListings = [
  { name: "Covered driveway", area: "Arera Colony, Bhopal", rate: 110, size: "320 sq ft", status: "Available", occupancy: 62 },
  { name: "Secure basement spot", area: "MP Nagar, Bhopal", rate: 150, size: "280 sq ft", status: "Occupied", occupancy: 84 },
  { name: "Private outdoor space", area: "Shahpura, Bhopal", rate: 90, size: "400 sq ft", status: "Available", occupancy: 48 },
];

const weeklyEarnings = [
  { day: "Mon", value: 1800 },
  { day: "Tue", value: 2400 },
  { day: "Wed", value: 1500 },
  { day: "Thu", value: 3200 },
  { day: "Fri", value: 2700 },
  { day: "Sat", value: 4100 },
  { day: "Sun", value: 3600 },
];

function formatDateTime(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function UserProfile() {
  const currentLocation = useAuthStore((state) => state.currentLocation);
  const userCar = useAuthStore((state) => state.userCar);
  const user = useAuthStore((state) => state.user);
  const [view, setView] = useState<"customer" | "provider">("customer");
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [activeBookingDetails, setActiveBookingDetails] = useState<BookingData[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const getActiveBookings = async () => {
    if (!user?._id) {
      toast.error("Please log in to view your bookings.");
      return;
    }
    setLoadingBookings(true);
    try {
      const response = await axios.post("/api/activeBookings", { userId: user._id });
      setActiveBookingDetails(response.data.responseData ?? []);
      setShowBookingDetails(true);
    } catch (error: any) {
      console.error("Error fetching user bookings", error.response?.data?.message ?? error.message);
      toast.error("Could not fetch your bookings.");
    } finally {
      setLoadingBookings(false);
    }
  };

  const updateBooking = async (id: string, action: string) => {
    if (!user?._id) {
      toast.error("Please log in to update a booking.");
      return;
    }
    try {
      const response = await axios.post("/api/updateBooking", {
        userId: user._id,
        bookingId: id,
        action,
      });
      toast.success(response.data.message ?? "Booking updated.");
      await getActiveBookings();
    } catch (error: any) {
      console.error("Error updating booking", error.response?.data?.message ?? error.message);
      toast.error("Booking update failed.");
    }
  };

  const getDirection = (latitude: number, longitude: number) => {
    const origin = currentLocation?.latitude != null && currentLocation?.longitude != null
      ? `&origin=${currentLocation.latitude},${currentLocation.longitude}`
      : "";
    window.open(
      `https://www.google.com/maps/dir/?api=1${origin}&destination=${latitude},${longitude}&travelmode=driving`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main className="min-h-screen bg-[#F6F6F3] text-[#111111]">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="text-2xl font-black tracking-tight">parkify<span className="text-[#A8EF65]">.</span></Link>
          <div className="flex items-center gap-2 rounded-full border border-black/10 bg-[#F6F6F3] p-1">
            <button
              type="button"
              onClick={() => setView("customer")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${view === "customer" ? "bg-black text-white shadow-sm" : "text-black/60 hover:text-black"}`}
            >
              Customer
            </button>
            <Link
              href="/dashboard"
              className="rounded-full px-4 py-2 text-sm font-semibold text-black/60 transition-all hover:bg-white hover:text-black"
            >
              Provider dashboard
            </Link>
          </div>
        </div>
      </header>

      {view === "customer" ? (
        <section className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-black/50"><span className="h-2 w-2 rounded-full bg-[#A8EF65]" /> Your Parkify account</p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Good to see you, <span className="text-black/45">{user?.username?.split(" ")[0] || "there"}.</span></h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-black/55">Manage your details, vehicle, and parking reservations from one place.</p>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 self-start rounded-full border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-black/40 sm:self-auto"><ArrowLeft size={16} /> Back to parking</Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
            <div className="space-y-5">
              <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F1F1ED]"><UserRound size={20} /></div>
                  <div><h2 className="font-bold">Personal information</h2><p className="text-xs text-black/45">Your account details</p></div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoTile label="Full name" value={user?.username} />
                  <InfoTile label="Email address" value={user?.email} />
                  <InfoTile label="Phone number" value={user?.phoneNumber} />
                  <InfoTile label="Account type" value={user?.role || "Customer"} capitalize />
                  <InfoTile label="Address" value={user?.address} wide />
                </div>
              </section>

              <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-7">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F1F1ED]"><CarFront size={21} /></div>
                  <div><h2 className="font-bold">My vehicle</h2><p className="text-xs text-black/45">Vehicle details used for bookings</p></div>
                </div>
                {userCar ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <InfoTile label="Registration" value={userCar.license} />
                    <InfoTile label="Vehicle type" value={userCar.carType} capitalize />
                    <InfoTile label="Model" value={userCar.carModel} />
                    <InfoTile label="Colour" value={userCar.carColor} capitalize />
                  </div>
                ) : <p className="rounded-2xl bg-[#F6F6F3] p-4 text-sm text-black/55">No vehicle details are available on this account.</p>}
              </section>
            </div>

            <div className="space-y-5">
              <section className="rounded-3xl bg-[#111111] p-6 text-white shadow-[0_12px_35px_rgba(0,0,0,0.12)] sm:p-7">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Reservations</p><h2 className="mt-2 text-2xl font-bold">Your bookings</h2><p className="mt-2 text-sm leading-6 text-white/60">Review upcoming parking and manage your active reservations.</p></div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10"><CalendarCheck size={21} /></div>
                </div>
                <Button type="button" onClick={getActiveBookings} disabled={loadingBookings} className="mt-6 h-12 w-full rounded-xl bg-[#A8EF65] font-bold text-black hover:bg-[#BDF58A]">
                  {loadingBookings ? "Loading bookings…" : "View my bookings"}<ArrowRight size={16} className="ml-2" />
                </Button>
                <p className="mt-3 text-center text-xs text-white/40">Your booking actions remain connected to Parkify.</p>
              </section>

              <section className="rounded-3xl border border-black/10 bg-white p-5 sm:p-6">
                <div className="mb-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F1F1ED]"><ParkingSquare size={20} /></div><div><h2 className="font-bold">Provider preview</h2><p className="text-xs text-black/45">Thinking of listing a parking spot?</p></div></div>
                <p className="text-sm leading-6 text-black/55">Switch to the provider dashboard to explore a sample partner experience with listing cards and demo analytics.</p>
                <Link href="/dashboard" className="mt-4 inline-flex items-center gap-2 text-sm font-bold underline decoration-black/25 underline-offset-4 hover:decoration-black">Open provider dashboard <ArrowUpRight size={15} /></Link>
              </section>
            </div>
          </div>

          {showBookingDetails && (
            <section className="mt-7 rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">Reservation history</p><h2 className="mt-1 text-xl font-bold">Your active bookings</h2></div><button type="button" onClick={() => setShowBookingDetails(false)} className="rounded-full border border-black/10 p-2 transition hover:bg-black/5" aria-label="Hide bookings"><XCircle size={18} /></button></div>
              {activeBookingDetails.length === 0 ? (
                <div className="rounded-2xl bg-[#F6F6F3] px-4 py-8 text-center"><CalendarCheck className="mx-auto mb-2 text-black/35" size={25} /><p className="font-semibold">No active bookings</p><p className="mt-1 text-sm text-black/50">When you reserve a spot, it will appear here.</p><Link href="/" className="mt-4 inline-flex rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-800">Find More</Link></div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">{activeBookingDetails.map((booking) => (
                  <article key={booking._id} className="overflow-hidden rounded-2xl border border-black/10">
                    <div className="flex items-start justify-between gap-3 border-b border-black/5 bg-[#F6F6F3] p-4"><div><h3 className="font-bold">{booking.address || "Parking reservation"}</h3><p className="mt-1 text-xs text-black/45">Booking ID · {booking._id.slice(-8)}</p></div><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize">{booking.status}</span></div>
                    <div className="space-y-3 p-4"><div className="grid grid-cols-2 gap-3"><InfoTile label="Rate" value={`₹${booking.price_per_hour}/hour`} /><InfoTile label="Total" value={`₹${booking.totalPrice}`} /><InfoTile label="Starts" value={formatDateTime(booking.startTime)} /><InfoTile label="Ends" value={formatDateTime(booking.endTime)} /></div>
                      <div className="grid gap-2 sm:grid-cols-3"><Button type="button" onClick={() => updateBooking(booking._id, "complete")} className="rounded-xl bg-black text-white hover:bg-black/80"><CheckCircle2 size={15} className="mr-1"/> Complete</Button><Button type="button" variant="outline" onClick={() => updateBooking(booking._id, "cancel")} className="rounded-xl border-black/15"><XCircle size={15} className="mr-1"/> Cancel</Button><Button type="button" onClick={() => getDirection(booking.latitude, booking.longitude)} className="rounded-xl bg-[#A8EF65] text-black hover:bg-[#BDF58A]"><MapPin size={15} className="mr-1"/> Directions</Button></div>
                    </div>
                  </article>
                ))}</div>
              )}
            </section>
          )}
        </section>
      ) : (
        <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
          <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div><p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-black/50"><span className="h-2 w-2 rounded-full bg-[#A8EF65]"/> Parkify partner workspace <span className="rounded-full border border-black/10 bg-white px-2 py-1 text-[9px] tracking-[0.12em]">DEMO DATA</span></p><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Your spaces. <span className="text-black/40">Your business.</span></h1><p className="mt-2 max-w-2xl text-sm leading-6 text-black/55">A sample view of how parking providers could monitor listings, reservations, and earnings.</p></div>
            <button type="button" onClick={() => setView("customer")} className="inline-flex items-center gap-2 self-start rounded-full border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-black/40 lg:self-auto"><ArrowLeft size={16}/> Back to customer profile</button>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Total earnings" value="₹24,850" detail="+12.8% vs last month" icon={<Wallet size={19}/>} positive />
            <MetricCard title="Reservations" value="186" detail="Across all sample listings" icon={<CalendarCheck size={19}/>} />
            <MetricCard title="Active spaces" value="4" detail="3 available · 1 occupied" icon={<ParkingSquare size={19}/>} />
            <MetricCard title="Average occupancy" value="78%" detail="+6.4% this month" icon={<TrendingUp size={19}/>} positive />
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
            <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-3"><div><h2 className="text-lg font-bold">Earnings overview</h2><p className="mt-1 text-sm text-black/45">Illustrative weekly earnings · INR</p></div><span className="rounded-full bg-[#F1F1ED] px-3 py-1.5 text-xs font-semibold">Last 7 days</span></div>
              <div className="flex h-56 items-end gap-3 border-b border-black/10 pb-2 sm:gap-5">{weeklyEarnings.map((item) => <div key={item.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] font-medium text-black/45">{(item.value / 1000).toFixed(1)}k</span><div title={`₹${item.value.toLocaleString("en-IN")}`} className="w-full max-w-12 rounded-t-lg bg-[#A8EF65] transition-all duration-500 hover:bg-black" style={{ height: `${(item.value / 4500) * 72}%`, minHeight: "12px" }}/><span className="text-xs text-black/45">{item.day}</span></div>)}</div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm text-black/45">Gross earnings this week</p><p className="mt-1 text-2xl font-bold">₹19,300</p></div><span className="inline-flex items-center gap-1 rounded-full bg-[#F0F9E8] px-3 py-1.5 text-xs font-semibold text-[#426B20]"><TrendingUp size={13}/> Sample +8.2%</span></div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-7">
              <div className="mb-6"><h2 className="text-lg font-bold">Space occupancy</h2><p className="mt-1 text-sm text-black/45">Sample booking utilization</p></div>
              <div className="space-y-5">{[{ name: "Covered driveway", percent: 62 }, { name: "Secure basement spot", percent: 84 }, { name: "Private outdoor space", percent: 48 }, { name: "Office parking bay", percent: 76 }].map((item) => <div key={item.name}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="font-medium">{item.name}</span><span className="text-black/50">{item.percent}%</span></div><div className="h-2 overflow-hidden rounded-full bg-[#F0F0EC]"><div className="h-full rounded-full bg-black transition-all duration-700" style={{ width: `${item.percent}%` }}/></div></div>)}</div>
              <div className="mt-7 rounded-2xl bg-[#F6F6F3] p-4"><p className="text-sm font-semibold">Partner tip</p><p className="mt-1 text-sm leading-5 text-black/55">Clear photos, accurate availability, and competitive hourly rates can help listings stand out.</p></div>
            </section>
          </div>

          <section className="mt-5 rounded-3xl border border-black/10 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] sm:p-7">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-lg font-bold">Your parking listings</h2><p className="mt-1 text-sm text-black/45">Fictional sample spaces for the provider demo</p></div><span className="inline-flex items-center gap-2 self-start rounded-full bg-[#F1F1ED] px-3 py-1.5 text-xs font-semibold"><LayoutDashboard size={14}/> {demoListings.length} sample listings</span></div>
            <div className="grid gap-4 lg:grid-cols-3">{demoListings.map((listing, index) => <article key={listing.name} className="rounded-2xl border border-black/10 p-4 transition hover:-translate-y-0.5 hover:shadow-md"><div className="mb-4 flex items-start justify-between gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F1F1ED]"><ParkingSquare size={20}/></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${listing.status === "Available" ? "bg-[#F0F9E8] text-[#426B20]" : "bg-[#F2F2EF] text-black/60"}`}>{listing.status}</span></div><h3 className="font-bold">{listing.name}</h3><p className="mt-1 flex items-center gap-1 text-xs text-black/45"><MapPin size={12}/>{listing.area}</p><div className="my-4 grid grid-cols-2 gap-2"><div className="rounded-xl bg-[#F6F6F3] p-3"><p className="text-[10px] uppercase tracking-wider text-black/40">Hourly rate</p><p className="mt-1 font-bold">₹{listing.rate}<span className="text-xs font-normal text-black/45">/hr</span></p></div><div className="rounded-xl bg-[#F6F6F3] p-3"><p className="text-[10px] uppercase tracking-wider text-black/40">Area</p><p className="mt-1 font-bold">{listing.size}</p></div></div><div className="flex items-center justify-between text-xs text-black/45"><span>Occupancy</span><span className="font-semibold text-black">{listing.occupancy}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F0F0EC]"><div className="h-full rounded-full bg-[#A8EF65]" style={{ width: `${listing.occupancy}%` }}/></div><p className="mt-3 text-[10px] text-black/35">Demo listing {String(index + 1).padStart(2, "0")}</p></article>)}</div>
          </section>
          <p className="mt-5 text-center text-xs text-black/40">Demo dashboard · All analytics, earnings, occupancy and listings shown here are fictional sample data.</p>
        </section>
      )}
    </main>
  );
}

function InfoTile({ label, value, wide = false, capitalize = false }: { label: string; value?: string | number | null; wide?: boolean; capitalize?: boolean }) {
  return <div className={`min-w-0 rounded-2xl bg-[#F6F6F3] px-4 py-3 ${wide ? "sm:col-span-2" : ""}`}><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/40">{label}</p><p className={`mt-1 break-words text-sm font-semibold ${capitalize ? "capitalize" : ""}`}>{value || "Not provided"}</p></div>;
}

function MetricCard({ title, value, detail, icon, positive = false }: { title: string; value: string; detail: string; icon: React.ReactNode; positive?: boolean }) {
  return <article className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.035)] transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-center justify-between gap-3"><span className="text-sm text-black/50">{title}</span><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F1F1ED]">{icon}</span></div><p className="mt-4 text-3xl font-bold tracking-tight">{value}</p><p className={`mt-2 text-xs ${positive ? "text-[#527C2A]" : "text-black/40"}`}>{detail}</p></article>;
}

export default UserProfile;
