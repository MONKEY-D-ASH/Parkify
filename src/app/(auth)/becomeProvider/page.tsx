"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { MapPin, IndianRupee, Clock3, CheckCircle2, CircleX, ParkingSquare, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/Auth";

function RegistrationPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUserParkingSpace = useAuthStore((state) => state.setUserParkingSpace);
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    address: "",
    price_per_hour: "",
    availabilityStatus: true,
  });

  const handleUserRegistration = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const address = formData.address.trim();
    const price = Number(formData.price_per_hour);

    if (!address || !formData.price_per_hour.trim()) {
      toast.error("Please enter your parking address and hourly rate.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Enter a valid hourly rate greater than ₹0.");
      return;
    }
    if (!user?._id) {
      toast.error("Please log in before registering as a provider.");
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        userId: user._id,
        address,
        price_per_hour: String(price),
        availabilityStatus: formData.availabilityStatus,
      };
      const response = await axios.post("/api/becomeProvider", data);
      setUserParkingSpace(response.data.userSpace);
      toast.success(response.data.message || "Your provider listing has been created.");
      router.push("/");
    } catch (error: unknown) {
      console.error("Provider registration failed", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "Could not register as a provider. Please try again.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F7F7F4] text-[#111111]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="text-xl font-black tracking-tight" aria-label="Parkify home">
            parkify<span className="text-[#A3E635]">.</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 sm:text-sm">
            <ShieldCheck className="h-4 w-4" />
            <span>Simple, secure parking</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <section className="relative overflow-hidden rounded-[28px] bg-[#111111] p-7 text-white sm:p-10 lg:min-h-[560px] lg:p-12">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#A3E635]/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-[#A3E635]/10 blur-3xl" />
          <div className="relative flex h-full flex-col">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C8F78A]">
              <Sparkles className="h-3.5 w-3.5" /> Your space, your earnings
            </div>
            <h1 className="mt-7 max-w-md text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
              Turn your parking space into <span className="text-[#A3E635]">something valuable.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/65 sm:text-base">
              List your driveway, garage, or private parking spot on Parkify. Set your hourly rate and choose when it is available.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A3E635] text-black">
                  <IndianRupee className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-semibold">Set your own rate</h2>
                <p className="mt-1 text-xs leading-5 text-white/55">Choose a price that works for your space.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#C8F78A]">
                  <Clock3 className="h-5 w-5" />
                </div>
                <h2 className="mt-4 font-semibold">Control availability</h2>
                <p className="mt-1 text-xs leading-5 text-white/55">Mark your spot available or unavailable.</p>
              </div>
            </div>

            <div className="mt-auto flex items-start gap-3 border-t border-white/10 pt-7 sm:mt-12">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10">
                <ParkingSquare className="h-4 w-4 text-[#C8F78A]" />
              </div>
              <div>
                <p className="text-sm font-medium">A few details and you’re ready to go.</p>
                <p className="mt-1 text-xs leading-5 text-white/50">You can update your listing after registration.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl">
          <Link href="/profile" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-black">
            <ArrowLeft className="h-4 w-4" /> Back to profile
          </Link>
          <div className="mb-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#84CC16] align-middle" /> Partner setup
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Register your space</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Add your location, choose your rate, and set your current availability.</p>
          </div>

          <div className="rounded-[24px] border border-black/10 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.045)] sm:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-black/[0.08] pb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F2F2EF]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Parking listing details</h3>
                <p className="mt-0.5 text-xs text-neutral-500">Tell drivers where your spot is.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label htmlFor="provider-address" className="mb-2 block text-sm font-medium">Parking address</label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <Input
                    id="provider-address"
                    type="text"
                    autoComplete="street-address"
                    placeholder="Enter the full parking address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="h-12 rounded-xl border-black/10 bg-[#F8F8F6] pl-10 text-sm text-[#111111] placeholder:text-neutral-400 focus-visible:border-black focus-visible:ring-black/10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="provider-rate" className="mb-2 block text-sm font-medium">Price per hour</label>
                <div className="relative">
                  <IndianRupee className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <Input
                    id="provider-rate"
                    type="number"
                    min="1"
                    step="1"
                    inputMode="decimal"
                    placeholder="e.g. 100"
                    required
                    value={formData.price_per_hour}
                    onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
                    className="h-12 rounded-xl border-black/10 bg-[#F8F8F6] pl-10 text-sm text-[#111111] placeholder:text-neutral-400 focus-visible:border-black focus-visible:ring-black/10"
                  />
                </div>
                <p className="mt-2 text-xs text-neutral-500">Drivers will see this rate before booking.</p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-sm font-medium">Current availability</label>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${formData.availabilityStatus ? "text-[#4D7C0F]" : "text-neutral-500"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${formData.availabilityStatus ? "bg-[#84CC16]" : "bg-neutral-400"}`} />
                    {formData.availabilityStatus ? "Available now" : "Currently unavailable"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    aria-pressed={formData.availabilityStatus}
                    onClick={() => setFormData({ ...formData, availabilityStatus: true })}
                    className={`flex min-h-14 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-all duration-200 ${formData.availabilityStatus ? "border-[#111111] bg-[#111111] text-white shadow-sm" : "border-black/10 bg-white text-neutral-600 hover:border-black/30 hover:bg-neutral-50"}`}
                  >
                    <CheckCircle2 className="h-4 w-4" /> Available
                  </button>
                  <button
                    type="button"
                    aria-pressed={!formData.availabilityStatus}
                    onClick={() => setFormData({ ...formData, availabilityStatus: false })}
                    className={`flex min-h-14 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-all duration-200 ${!formData.availabilityStatus ? "border-[#111111] bg-[#111111] text-white shadow-sm" : "border-black/10 bg-white text-neutral-600 hover:border-black/30 hover:bg-neutral-50"}`}
                  >
                    <CircleX className="h-4 w-4" /> Unavailable
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-[#F7F7F4] p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                  <p className="text-xs leading-5 text-neutral-500">Check your address and hourly rate before submitting. These details will be used to create your provider listing.</p>
                </div>
              </div>

              <Button
                type="button"
                disabled={isLoading}
                onClick={handleUserRegistration}
                className="group h-12 w-full rounded-xl bg-[#111111] text-sm font-semibold text-white transition-all duration-200 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Creating your listing…" : "Become a provider"}
                {!isLoading && <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>}
              </Button>
              <p className="text-center text-[11px] text-neutral-400">By continuing, you agree to use Parkify responsibly.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default RegistrationPage;
