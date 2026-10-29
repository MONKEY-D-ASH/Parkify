"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import axios from "axios"
import Link from "next/link"

const vehicleOptions = [
  {
    value: "sedan",
    emoji: "🚘",
    title: "Sedan",
    description: "Comfortable everyday drives",
  },
  {
    value: "suv",
    emoji: "🚙",
    title: "SUV",
    description: "More room for everyone",
  },
  {
    value: "hatchback",
    emoji: "🚗",
    title: "Hatchback",
    description: "Compact and city-friendly",
  },
  {
    value: "luxury",
    emoji: "🏎️",
    title: "Luxury",
    description: "A little extra style",
  },
]

function RegistrationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    license: "",
    carModel: "",
    carColor: "",
    carType: "",
  })

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const handleUserRegistration = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()

    const missingField = Object.values(formData).some(
      (value) => value.trim().length === 0
    )

    if (missingField) {
      toast.error("Please fill out all fields and select a vehicle type.")
      return
    }

    setIsLoading(true)

    const data = {
      username: `${formData.firstname} ${formData.lastname}`,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      license: formData.license,
      carModel: formData.carModel,
      carColor: formData.carColor,
      carType: formData.carType,
    }

    try {
      await axios.post("./api/registerUser", data)
      toast.success("Account created successfully")
      router.push("/")
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.error || "Registration failed")
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass =
    "h-11 rounded-xl border-[#E5E5E5] bg-white text-[#111111] placeholder:text-[#888888] focus-visible:border-black focus-visible:ring-black/10"

  const labelClass = "text-sm font-medium text-[#222222]"

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111111]">
      {/* Parkify-style header */}
      <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between bg-black px-5 text-white sm:px-10 lg:px-16">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-[-0.06em] transition-opacity hover:opacity-80"
          aria-label="Parkify home"
        >
          parkify<span className="text-[#A3E635]">.</span>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden text-white/65 sm:inline">
            Already have an account?
          </span>
          <Link
            href="/login"
            className="rounded-full border border-white/25 px-5 py-2.5 font-semibold transition-colors hover:bg-white hover:text-black"
          >
            Log in
          </Link>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-12 lg:py-12">
        {/* Intro panel */}
        <aside className="relative hidden overflow-hidden rounded-3xl bg-[#F0F0EC] p-9 lg:flex lg:min-h-[690px] lg:flex-col lg:justify-between">
          <div className="absolute -right-20 -top-16 h-64 w-64 rounded-full bg-[#D9F99D]/70 blur-2xl" />
          <div className="absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-white blur-2xl" />

          <div className="relative">
            <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#555555]">
              <span className="h-2 w-2 rounded-full bg-lime-500" />
              One account. Easier parking.
            </p>
            <h1 className="max-w-md text-5xl font-semibold leading-[1.06] tracking-[-0.06em]">
              Your next stop starts <span className="text-[#858585]">here.</span>
            </h1>
            <p className="mt-5 max-w-sm text-base leading-7 text-[#666666]">
              Create your Parkify account, add your vehicle, and make finding a
              parking spot a little less stressful.
            </p>
          </div>

          <div className="relative mt-12 rounded-3xl border border-black/5 bg-white/80 p-6 shadow-sm backdrop-blur">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#777777]">
                  Your garage
                </p>
                <p className="mt-1 text-lg font-semibold">Pick your ride</p>
              </div>
              <span className="rounded-full bg-[#F0F0EC] px-3 py-1 text-xs font-medium text-[#555555]">
                4 types
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {vehicleOptions.map((vehicle) => (
                <div
                  key={vehicle.value}
                  className="group flex flex-col items-center rounded-2xl bg-[#F7F7F5] px-2 py-4 transition-all duration-200 hover:-translate-y-1 hover:bg-[#EDFCCB]"
                >
                  <span className="text-3xl transition-transform duration-200 group-hover:scale-125 group-hover:-rotate-6">
                    {vehicle.emoji}
                  </span>
                  <span className="mt-2 text-[11px] font-semibold text-[#444444]">
                    {vehicle.title}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-black p-4 text-white">
              <span className="text-2xl">🅿️</span>
              <div>
                <p className="text-sm font-semibold">Park smarter</p>
                <p className="mt-0.5 text-xs text-white/65">
                  Spend less time searching.
                </p>
              </div>
              <span className="ml-auto text-xl text-lime-300">↗</span>
            </div>
          </div>
        </aside>

        {/* Registration form */}
        <section className="mx-auto w-full max-w-2xl">
          <div className="mb-7">
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#666666]">
              <span className="h-2 w-2 rounded-full bg-lime-500" />
              Get started for free
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
              Create your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#666666]">
              Your details and vehicle information, all in one place.
            </p>
          </div>

          <div className="rounded-3xl border border-[#E8E8E8] bg-white p-5 shadow-[0_12px_45px_rgba(0,0,0,0.04)] sm:p-8">
            <FieldGroup>
              <div className="mb-1 flex items-center gap-2 border-b border-[#EEEEEE] pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F2F0] text-base">
                  👤
                </span>
                <h3 className="font-semibold">Personal information</h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="fieldgroup-firstname" className={labelClass}>
                    First name
                  </FieldLabel>
                  <Input
                    className={inputClass}
                    id="fieldgroup-firstname"
                    type="text"
                    placeholder="First name"
                    autoComplete="given-name"
                    required
                    value={formData.firstname}
                    onChange={(e) => updateField("firstname", e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="fieldgroup-lastname" className={labelClass}>
                    Last name
                  </FieldLabel>
                  <Input
                    className={inputClass}
                    id="fieldgroup-lastname"
                    type="text"
                    placeholder="Last name"
                    autoComplete="family-name"
                    required
                    value={formData.lastname}
                    onChange={(e) => updateField("lastname", e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="fieldgroup-email" className={labelClass}>
                    Email address
                  </FieldLabel>
                  <Input
                    className={inputClass}
                    id="fieldgroup-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="fieldgroup-password" className={labelClass}>
                    Password
                  </FieldLabel>
                  <Input
                    className={inputClass}
                    id="fieldgroup-password"
                    type="password"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                  />
                  <FieldDescription className="text-xs text-[#777777]">
                    Use 8–255 characters.
                  </FieldDescription>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="fieldgroup-phoneNumber" className={labelClass}>
                    Phone number
                  </FieldLabel>
                  <Input
                    className={inputClass}
                    id="fieldgroup-phoneNumber"
                    type="tel"
                    placeholder="10-digit phone number"
                    autoComplete="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => updateField("phoneNumber", e.target.value)}
                  />
                  <FieldDescription className="text-xs text-[#777777]">
                    Enter a valid 10-digit number.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="fieldgroup-address" className={labelClass}>
                    Address
                  </FieldLabel>
                  <Input
                    className={inputClass}
                    id="fieldgroup-address"
                    type="text"
                    placeholder="Your current address"
                    autoComplete="street-address"
                    required
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                  />
                </Field>
              </div>

              <div className="mb-1 mt-4 flex items-center gap-2 border-b border-[#EEEEEE] pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F2F0] text-base">
                  🚘
                </span>
                <h3 className="font-semibold">Your vehicle</h3>
                <span className="ml-auto text-xs text-[#777777]">
                  Tell us what you drive
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="fieldgroup-license-plate" className={labelClass}>
                    License plate
                  </FieldLabel>
                  <Input
                    className={inputClass}
                    id="fieldgroup-license-plate"
                    type="text"
                    placeholder="e.g. DL 01 AB 1234"
                    autoCapitalize="characters"
                    required
                    value={formData.license}
                    onChange={(e) => updateField("license", e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="fieldgroup-vehicle-model" className={labelClass}>
                    Vehicle model
                  </FieldLabel>
                  <Input
                    className={inputClass}
                    id="fieldgroup-vehicle-model"
                    type="text"
                    placeholder="e.g. Honda City"
                    required
                    value={formData.carModel}
                    onChange={(e) => updateField("carModel", e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="fieldgroup-vehicle-color" className={labelClass}>
                    Vehicle colour
                  </FieldLabel>
                  <Input
                    className={inputClass}
                    id="fieldgroup-vehicle-color"
                    type="text"
                    placeholder="e.g. White"
                    required
                    value={formData.carColor}
                    onChange={(e) => updateField("carColor", e.target.value)}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel className={labelClass}>
                  Choose your vehicle type
                </FieldLabel>
                <p className="mb-1 text-xs text-[#777777]">
                  Pick the ride that best matches your vehicle.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {vehicleOptions.map((vehicle) => {
                    const selected = formData.carType === vehicle.value

                    return (
                      <button
                        key={vehicle.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => updateField("carType", vehicle.value)}
                        className={`group relative flex min-h-[132px] flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
                          selected
                            ? "border-black bg-black text-white shadow-lg shadow-black/10"
                            : "border-[#E5E5E5] bg-white text-[#222222] hover:-translate-y-1 hover:border-[#A3E635] hover:bg-[#FAFFF0]"
                        }`}
                      >
                        {selected && (
                          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#A3E635] text-xs font-bold text-black">
                            ✓
                          </span>
                        )}
                        <span
                          className={`text-4xl transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110 ${
                            selected ? "animate-bounce" : ""
                          }`}
                        >
                          {vehicle.emoji}
                        </span>
                        <span className="mt-2 text-sm font-semibold">
                          {vehicle.title}
                        </span>
                        <span
                          className={`mt-1 text-[10px] leading-4 ${
                            selected ? "text-white/65" : "text-[#777777]"
                          }`}
                        >
                          {vehicle.description}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </Field>

              <Field orientation="horizontal">
                <Button
                  type="button"
                  disabled={isLoading}
                  className="mt-3 h-12 w-full rounded-xl bg-black font-semibold text-white transition-all hover:bg-[#262626] disabled:opacity-60"
                  onClick={handleUserRegistration}
                >
                  {isLoading ? "Creating your account..." : "Create account"}
                  {!isLoading && <span className="ml-2 text-lg">→</span>}
                </Button>
              </Field>

              <p className="text-center text-xs leading-5 text-[#777777]">
                By creating an account, you agree to use Parkify responsibly.
              </p>
            </FieldGroup>
          </div>

          <p className="mt-6 text-center text-sm text-[#666666]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-black underline underline-offset-4 hover:text-[#555555]"
            >
              Log in
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}

export default RegistrationPage
