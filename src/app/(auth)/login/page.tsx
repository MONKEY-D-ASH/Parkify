"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/Auth";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

function LoginUser() {
  const {
    setUserDetails,
    setUserCarDetails,
    setUserParkingSpace,
  } = useAuthStore();

  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  // Keep the existing backend login flow and Zustand updates.
  const handleLoginClick = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!user.email.trim() || !user.password) {
      toast.error("Please enter your email and password");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post("./api/login", user);

      setUserDetails(response.data.user);
      setUserCarDetails(response.data.userCar);

      if (response?.data?.userParkingSpace?.length > 0) {
        setUserParkingSpace(response.data.userParkingSpace);
      }

      toast.success("Login successful");
      router.push("/");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown login error";
      console.error("There was an error logging in:", message);
      toast.error("Login failed. Check your details and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fafaf8] text-[#111111]">
      {/* Minimal Parkify header, consistent with the redesigned signup page. */}
      <header className="flex h-[68px] items-center justify-between border-b border-black/5 bg-black px-5 text-white sm:px-8 lg:px-12">
        <Link
          href="/"
          aria-label="Parkify home"
          className="text-xl font-black tracking-[-0.07em] sm:text-2xl"
        >
          parkify<span className="text-[#9be34a]">.</span>
        </Link>

        <div className="flex items-center gap-2 text-xs sm:gap-4 sm:text-sm">
          <span className="hidden text-white/65 sm:inline">
            New to Parkify?
          </span>
          <Link
            href="/registerUser"
            className="rounded-full border border-white/25 px-4 py-2 font-semibold transition-colors hover:border-[#9be34a] hover:text-[#b7f477]"
          >
            Sign up
          </Link>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-68px)] w-full max-w-6xl items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-12 lg:py-14">
        {/* Brand panel */}
        <aside className="relative hidden min-h-[520px] overflow-hidden rounded-[28px] bg-[#eaf6d7] p-9 lg:flex lg:flex-col lg:justify-between">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border-[1px] border-[#b7d98b] opacity-70"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full border-[1px] border-[#b7d98b] opacity-70"
          />

          <div className="relative">
            <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#3e5427]">
              <span className="h-2 w-2 rounded-full bg-[#8bd43f]" />
              Welcome back
            </div>
            <h1 className="max-w-sm text-5xl font-semibold leading-[1.04] tracking-[-0.065em]">
              Your next stop
              <br />
              starts <span className="text-black/45">here.</span>
            </h1>
            <p className="mt-5 max-w-xs text-sm leading-6 text-black/65">
              Sign in to find parking, manage your vehicle, and make every
              arrival a little less stressful.
            </p>
          </div>

          <div className="relative rounded-2xl border border-black/[0.06] bg-white/85 p-5 shadow-sm backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/45">
                  Your parking companion
                </p>
                <p className="mt-1 text-sm font-semibold">Park smarter.</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf6d7] text-2xl transition-transform duration-300 hover:rotate-[-8deg] hover:scale-110">
                🚘
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#9be34a] text-sm">
                P
              </span>
              <div>
                <p className="text-xs font-semibold">A spot when you need it</p>
                <p className="mt-0.5 text-[10px] text-white/60">
                  Less circling. More arriving.
                </p>
              </div>
              <span className="ml-auto text-[#9be34a]">↗</span>
            </div>
          </div>
        </aside>

        {/* Login form */}
        <div className="mx-auto w-full max-w-md">
          <div className="mb-7">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5d762e]">
              <span className="h-2 w-2 rounded-full bg-[#8bd43f]" />
              Pick up where you left off
            </div>
            <h2 className="text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">
              Welcome back.
            </h2>
            <p className="mt-3 text-sm leading-6 text-black/55">
              Enter your details to access your Parkify account.
            </p>
          </div>

          <div className="rounded-[24px] border border-black/[0.08] bg-white p-6 shadow-[0_16px_50px_rgba(0,0,0,0.045)] sm:p-8">
            <form onSubmit={handleLoginClick}>
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel
                    htmlFor="login-email"
                    className="text-xs font-semibold text-[#222]"
                  >
                    Email address
                  </FieldLabel>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={user.email}
                    required
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    className="h-12 rounded-xl border-[#e5e5e2] bg-[#fafaf9] px-4 text-sm text-[#111] placeholder:text-black/35 focus-visible:border-[#111] focus-visible:ring-2 focus-visible:ring-[#9be34a]/40"
                  />
                </Field>

                <Field>
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel
                      htmlFor="login-password"
                      className="text-xs font-semibold text-[#222]"
                    >
                      Password
                    </FieldLabel>
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="text-xs font-medium text-black/55 transition-colors hover:text-black"
                    >
                      {showPassword ? "Hide password" : "Show password"}
                    </button>
                  </div>
                  <Input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={user.password}
                    required
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    className="h-12 rounded-xl border-[#e5e5e2] bg-[#fafaf9] px-4 text-sm text-[#111] placeholder:text-black/35 focus-visible:border-[#111] focus-visible:ring-2 focus-visible:ring-[#9be34a]/40"
                  />
                </Field>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 h-12 w-full rounded-xl bg-black text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#242424] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                      Signing you in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Log in <span aria-hidden="true">→</span>
                    </span>
                  )}
                </Button>
              </FieldGroup>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-black/10" />
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-black/35">
                New around here?
              </span>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            <Link
              href="/registerUser"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-black/15 bg-white text-sm font-semibold text-black transition-all duration-200 hover:border-black hover:bg-[#fafaf8]"
            >
              Create an account
            </Link>
          </div>

          <p className="mt-5 text-center text-[11px] leading-5 text-black/45">
            By continuing, you agree to use Parkify responsibly.
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginUser;
