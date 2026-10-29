"use client";

import React, { useMemo, useState } from "react";
import { CalendarDays, Clock3, MapPin, CarFront, UserRound, ShieldCheck, ArrowRight, CheckCircle2, Navigation, CalendarCheck, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";

function localDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateString: string) {
  if (!dateString) return "Choose a date";
  return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(time: string) {
  if (!time) return "--:--";
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}

function BookSpace() {
  const currentLocation = useAuthStore((state) => state.currentLocation);
  const bookingLocationDetails = useAuthStore((state) => state.bookingLocationDetails);
  const userCar = useAuthStore((state) => state.userCar);
  const user = useAuthStore((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [showGetDirection, setShowGetDirection] = useState(false);
  const [hasCalculatedPrice, setHasCalculatedPrice] = useState(false);
  const [bookingDate, setBookingDate] = useState(localDateString);
  const [bookingDetails, setBookingDetails] = useState({
    arrivalTime: "",
    departureTime: "",
    totalPrice: 0,
  });

  const durationHours = useMemo(() => {
    if (!bookingDetails.arrivalTime || !bookingDetails.departureTime) return 0;
    const [startHour, startMinute] = bookingDetails.arrivalTime.split(":").map(Number);
    const [endHour, endMinute] = bookingDetails.departureTime.split(":").map(Number);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    if (end <= start) return 0;
    return (end - start) / 60;
  }, [bookingDetails.arrivalTime, bookingDetails.departureTime]);

  const pricePerHour = Number(bookingLocationDetails?.price_per_hour ?? 0);
  const calculatedPrice = Number((durationHours * pricePerHour).toFixed(2));

  const setPrice = () => {
    if (!bookingDate) {
      toast.error("Please choose your parking date.");
      return;
    }
    if (!bookingDetails.arrivalTime || !bookingDetails.departureTime) {
      toast.error("Choose both arrival and departure times.");
      return;
    }
    if (durationHours <= 0) {
      toast.error("Departure must be later than arrival on the same day.");
      return;
    }
    if (!pricePerHour || pricePerHour < 0) {
      toast.error("The parking price is unavailable for this location.");
      return;
    }
    setBookingDetails((current) => ({ ...current, totalPrice: calculatedPrice }));
    setHasCalculatedPrice(true);
    toast.success("Price calculated.");
  };

  const bookParkingSpace = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!bookingDate || !bookingDetails.arrivalTime || !bookingDetails.departureTime) {
      toast.error("Choose a date, arrival time, and departure time.");
      return;
    }
    if (durationHours <= 0) {
      toast.error("Departure must be later than arrival.");
      return;
    }
    if (!hasCalculatedPrice || bookingDetails.totalPrice !== calculatedPrice || bookingDetails.totalPrice <= 0) {
      toast.error("Please calculate the price before booking.");
      return;
    }
    if (!user?._id || !bookingLocationDetails) {
      toast.error("Your user or parking details are missing. Please return to the map and try again.");
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        userId: user._id,
        address: bookingLocationDetails.name,
        latitude: bookingLocationDetails.latitude,
        longitude: bookingLocationDetails.longitude,
        price_per_hour: pricePerHour,
        bookingDate,
        arrivalTime: bookingDetails.arrivalTime,
        departureTime: bookingDetails.departureTime,
        durationHours: Number(durationHours.toFixed(2)),
        totalPrice: bookingDetails.totalPrice,
      };

      await axios.post("/api/booking", data);
      toast.success("Parking booking created successfully.");
      setShowGetDirection(true);
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : "Booking failed. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getDirection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!bookingLocationDetails?.latitude || !bookingLocationDetails?.longitude) {
      toast.error("Parking coordinates are unavailable.");
      return;
    }
    const origin =
      currentLocation?.latitude != null && currentLocation?.longitude != null
        ? `&origin=${currentLocation.latitude},${currentLocation.longitude}`
        : "";
    window.location.href = `https://google.com/maps/dir/?api=1${origin}&destination=${bookingLocationDetails.latitude},${bookingLocationDetails.longitude}&travelmode=driving`;
  };

  return (
    <main className="min-h-screen bg-[#f6f6f3] text-[#111111]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="text-2xl font-black tracking-tight">
            parkify<span className="text-[#9BE564]">.</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-medium text-black/55 sm:text-sm">
            <ShieldCheck size={16} />
            <span>Simple, secure parking</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-black/50">
            <span className="h-2 w-2 rounded-full bg-[#9BE564]" />
            Your spot is waiting
          </p>
          <h1 className="text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
            Make room for <span className="text-black/40">what matters.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-black/55 sm:text-base">
            Choose when you&apos;ll arrive, set your departure time, and confirm your parking plan.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
          <section className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_18px_60px_rgba(0,0,0,0.045)] animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="flex items-start justify-between gap-4 border-b border-black/8 px-5 py-5 sm:px-7">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">Parking destination</p>
                <h2 className="mt-2 truncate text-xl font-semibold tracking-tight">
                  {bookingLocationDetails?.name || "Your selected parking spot"}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-black/50">
                  <MapPin size={14} />
                  Selected from the map
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f2f2ee]">
                <CarFront size={24} strokeWidth={1.7} />
              </div>
            </div>

            <div className="space-y-7 p-5 sm:p-7">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <CalendarDays size={17} />
                  <h3 className="font-semibold">Choose your date</h3>
                </div>
                <label className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-black/10 bg-[#fafaf8] p-4 transition-all duration-200 hover:border-black/30 hover:bg-white focus-within:border-black">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-transform group-hover:scale-105">
                    <CalendarCheck size={21} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-black/45">Parking date</span>
                    <span className="mt-1 block truncate text-sm font-semibold">{formatDate(bookingDate)}</span>
                    <input
                      aria-label="Parking date"
                      type="date"
                      min={localDateString()}
                      value={bookingDate}
                      onChange={(e) => {
                        setBookingDate(e.target.value);
                        setBookingDetails((current) => ({ ...current, totalPrice: 0 }));
                        setHasCalculatedPrice(false);
                        setShowGetDirection(false);
                      }}
                      className="mt-2 block w-full cursor-pointer rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-black"
                    />
                  </div>
                </label>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Clock3 size={17} />
                  <h3 className="font-semibold">Set your parking hours</h3>
                  <span className="ml-auto text-xs text-black/40">Same-day booking</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="rounded-2xl border border-black/10 p-4 transition-all duration-200 hover:border-black/30 focus-within:border-black">
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-black/45">
                      <span className="h-2 w-2 rounded-full bg-[#9BE564]" /> Arrival
                    </span>
                    <div className="mt-3 flex items-center gap-2">
                      <Clock3 size={20} className="text-black/45" />
                      <input
                        aria-label="Arrival time"
                        type="time"
                        value={bookingDetails.arrivalTime}
                        onChange={(e) => {
                          setBookingDetails((current) => ({ ...current, arrivalTime: e.target.value, totalPrice: 0 }));
                          setHasCalculatedPrice(false);
                          setShowGetDirection(false);
                        }}
                        className="min-w-0 flex-1 bg-transparent text-lg font-semibold outline-none"
                      />
                    </div>
                    <p className="mt-2 text-xs text-black/40">{formatTime(bookingDetails.arrivalTime)}</p>
                  </label>

                  <label className="rounded-2xl border border-black/10 p-4 transition-all duration-200 hover:border-black/30 focus-within:border-black">
                    <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-black/45">
                      <span className="h-2 w-2 rounded-full bg-black" /> Departure
                    </span>
                    <div className="mt-3 flex items-center gap-2">
                      <Clock3 size={20} className="text-black/45" />
                      <input
                        aria-label="Departure time"
                        type="time"
                        value={bookingDetails.departureTime}
                        onChange={(e) => {
                          setBookingDetails((current) => ({ ...current, departureTime: e.target.value, totalPrice: 0 }));
                          setHasCalculatedPrice(false);
                          setShowGetDirection(false);
                        }}
                        className="min-w-0 flex-1 bg-transparent text-lg font-semibold outline-none"
                      />
                    </div>
                    <p className="mt-2 text-xs text-black/40">{formatTime(bookingDetails.departureTime)}</p>
                  </label>
                </div>

                <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#f5f5f1] px-4 py-3">
                  <Timer size={17} className="text-black/50" />
                  <span className="text-sm text-black/60">Duration</span>
                  <span className="ml-auto text-sm font-semibold">
                    {durationHours > 0
                      ? `${Math.floor(durationHours)}h ${Math.round((durationHours % 1) * 60)}m`
                      : "Choose a valid time range"}
                  </span>
                </div>

                <Button
                  type="button"
                  onClick={setPrice}
                  className="mt-4 h-12 w-full rounded-xl border border-black/10 bg-[#f5f5f1] font-semibold text-black transition-all duration-200 hover:border-black/25 hover:bg-[#ededE7]"
                >
                  <Clock3 size={16} className="mr-2" />
                  {hasCalculatedPrice ? `Price calculated · ₹${bookingDetails.totalPrice.toFixed(2)}` : "Calculate price"}
                </Button>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <CarFront size={17} />
                  <h3 className="font-semibold">Your vehicle</h3>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    ["Registration", userCar?.license || "Not provided"],
                    ["Vehicle type", userCar?.carType || "Not provided"],
                    ["Model", userCar?.carModel || "Not provided"],
                    ["Colour", userCar?.carColor || "Not provided"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-[#f7f7f4] p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">{label}</p>
                      <p className="mt-1 truncate text-sm font-semibold">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f1ed]">
                    <UserRound size={19} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold">{user?.username || "Guest user"}</p>
                    <p className="truncate text-xs text-black/45">{user?.email || "Contact details unavailable"}</p>
                  </div>
                  <span className="ml-auto shrink-0 rounded-full bg-[#f4f4ef] px-3 py-1 text-[10px] font-semibold text-black/55">Booking profile</span>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section className="overflow-hidden rounded-3xl bg-[#111111] text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <div className="p-5 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Your reservation</p>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Booking summary</h2>
                    <p className="mt-1 max-w-[230px] truncate text-sm text-white/55">{bookingLocationDetails?.name || "Parking spot not selected"}</p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                    <CalendarCheck size={21} />
                  </div>
                </div>

                <div className="my-6 h-px bg-white/15" />

                <div className="space-y-4 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-white/50">Date</span>
                    <span className="text-right font-medium">{bookingDate ? formatDate(bookingDate) : "Not selected"}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/50">Arrival</span>
                    <span className="font-medium">{formatTime(bookingDetails.arrivalTime)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/50">Departure</span>
                    <span className="font-medium">{formatTime(bookingDetails.departureTime)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white/50">Rate</span>
                    <span className="font-medium">{pricePerHour > 0 ? `₹${pricePerHour.toFixed(2)} / hour` : "Not available"}</span>
                  </div>
                </div>

                <div className="my-6 h-px bg-white/15" />

                <div className="rounded-2xl bg-white/8 p-4">
                  <p className="text-xs text-white/50">Estimated total</p>
                  <div className="mt-1 flex items-end justify-between gap-3">
                    <p className="text-4xl font-semibold tracking-[-0.05em]">
                      ₹{bookingDetails.totalPrice.toFixed(2)}
                    </p>
                    <span className="pb-1 text-xs text-white/45">INR</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-white/45">
                    {bookingDetails.totalPrice > 0
                      ? "Price calculated from your selected duration."
                      : "Calculate your price to see the estimated total."}
                  </p>
                </div>

                <Button
                  type="button"
                  disabled={isLoading || !hasCalculatedPrice || bookingDetails.totalPrice !== calculatedPrice || bookingDetails.totalPrice <= 0}
                  className="mt-5 h-12 w-full rounded-xl bg-[#a8f06a] font-semibold text-black transition-all duration-200 hover:translate-y-[-1px] hover:bg-[#b9f78a] disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={bookParkingSpace}
                >
                  {isLoading ? "Confirming booking…" : "Confirm booking"}
                  {!isLoading && <ArrowRight size={17} className="ml-2" />}
                </Button>

                {showGetDirection && (
                  <Button
                    type="button"
                    className="mt-3 h-11 w-full rounded-xl bg-white/10 text-white transition hover:bg-white/20"
                    onClick={getDirection}
                  >
                    <Navigation size={16} className="mr-2" /> Get directions
                  </Button>
                )}
                <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-white/40">
                  <CheckCircle2 size={13} /> Review your time before confirming
                </p>
              </div>
            </section>

            <Link
              href="/profile"
              className="group flex items-center justify-between rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm font-semibold transition-all duration-200 hover:border-black/25 hover:shadow-sm"
            >
              <span>View your bookings</span>
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default BookSpace;
