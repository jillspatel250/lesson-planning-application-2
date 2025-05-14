"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, LoaderCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { resetPassword } from "./action";

export default function SignInPage() {
  const [load, setLoad] = useState(false);
  const [, setMessage] = useState<{
    success?: string;
    error?: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoad(true);
    toast('We will send you an email with instructions to reset your password');

    setTimeout(() => {
      window.open('https://mail.google.com/mail/u/0/#inbox', '_blank');
    } , 1500);

    const result = await resetPassword(formData);
    setMessage(result);
    setLoad(false);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full px-3 flex justify-between items-center">
        <div className="h-20 relative w-[340px]">
          <Image
            src="/charusat.jpg"
            alt="Charotar University of Science and Technology"
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

      {/* Main content */}
      <main className="flex-1 flex items-center justify-around px-24">
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

        {/* Right side - Login form */}
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

          <div className="w-full">
            <h3 className="text-3xl font-bold text-[#010922] pt-5 mb-6">
              Password Reset
            </h3>

            <form action={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-2xl font-medium text-[#010922] mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="bg-white border border-[#d9d9d9] text-[#010922] text-lg rounded-lg focus:ring-[#1a5ca1] focus:border-[#1a5ca1] block w-full pl-12 p-4"
                    placeholder="your.email@charusat.ac.in"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center h-12 bg-[#1a5ca1] hover:bg-[#154e8a] text-white font-bold py-4 px-4 rounded-lg text-xl cursor-pointer"
              >
                {load ? (
                  <div className="flex justify-between items-center gap-x-3">
                    <LoaderCircle className="animate-spin h-5 w-5 text-white" />
                    <p className="text-sm">Sending mail...</p>
                  </div>
                ) : (
                  <p className="text-sm">Send Reset Instructions</p>
                )}
              </button>
            </form>

            <Link
              href="/auth/login"
              className="flex items-center justify-end text-lg text-blue-600 hover:text-blue-800 mb-4 font-semibold underline"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
