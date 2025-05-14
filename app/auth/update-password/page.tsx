"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/utils/supabase/client";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

export default function UpdatePasswordPage() {
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [view1, setView1] = useState(false);
  const [view2, setView2] = useState(false);
  const [, setEmail] = useState("");
  const router = useRouter();

  const verifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const token = formData.get("otp") as string;
    const email = formData.get("email") as string;

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) {
        setError(error.message);
        toast("OTP verification failed");
      } else {
        setEmail(email);
        setIsOtpVerified(true);
        toast("OTP verified successfully");
      }
    } catch {
      setError("Unexpected error occurred.");
      toast("Unexpected error occurred");
    }

    setIsLoading(false);
  };

  const updatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
        toast("Password update failed");
      } else {
        setSuccess(true);
        toast("Password updated. Redirecting...");
        setTimeout(() => router.push("/auth/login"), 1500);
      }
    } catch {
      setError("Unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full px-3 flex justify-between items-center">
        <div className="h-20 relative w-[340px]">
          <Image
            src="/charusat.jpg"
            alt="Charotar University"
            fill
            className="object-contain object-left"
          />
        </div>
        <div className="h-26 relative w-[120px]">
          <Image
            src="/depstar.png"
            alt="DEPSTAR"
            fill
            className="object-contain object-right"
          />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-around px-24">
        {/* Left illustration */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start max-w-xl">
          <div className="relative w-full h-[600px]">
            <Image
              src="/login-page.png"
              alt="Classroom illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Right side - OTP / Password form */}
        <div className="w-full md:w-1/2 max-w-md">
          <div className="mb-8 flex items-center justify-right gap-x-3 px-3">
            <Image
              src="/lesson-flow.png"
              alt="Logo"
              className="mt-3"
              height={40}
              width={40}
            />
            <h2 className="text-5xl font-bold text-[#1a5ca1]">LessonFlow</h2>
          </div>

          <h2 className="text-3xl font-bold mt-5 mb-2">
            {isOtpVerified ? "Set New Password" : "Verify OTP"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {isOtpVerified
              ? "Enter your new password below"
              : "Enter the OTP sent to your email to continue"}
          </p>

          {!isOtpVerified ? (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="your.email@charusat.ac.in"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium" htmlFor="otp">
                  OTP (Check your email)
                </label>
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  required
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  placeholder="Enter 6 Digit OTP"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}

              <button
                type="submit"
                className="bg-[#0057A5] hover:bg-[#004384] text-white font-semibold py-2 rounded-md flex justify-center items-center gap-2 px-4 cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="animate-spin" size={18} />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={updatePassword} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium" htmlFor="password">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={view1 ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    className="w-full px-4 py-2 border rounded-md pr-10"
                  />
                  <div
                    className="absolute top-2.5 right-3 text-gray-500 cursor-pointer"
                    onClick={() => setView1(!view1)}
                  >
                  </div>
                </div>
              </div>

              <div>
                <label
                  className="block mb-1 font-medium"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={view2 ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    className="w-full px-4 py-2 border rounded-md pr-10"
                  />
                  <div
                    className="absolute top-2.5 right-1 text-gray-500 cursor-pointer"
                    onClick={() => setView2(!view2)}
                  >
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}

              {success && (
                <p className="text-sm text-green-600 font-medium">
                  Password updated successfully!
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#0057A5] hover:bg-[#004384] text-white font-semibold py-2 rounded-md flex justify-center items-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="animate-spin" size={18} />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
