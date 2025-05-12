"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center gap-y-2">
        <h1 className="font-semibold text-3xl text-red-600">Incorrect Credentials</h1>
        <Link href="/auth/login" className="text-blue-500 hover:underline">
          <Button className="cursor-pointer">
            <ArrowLeft />
            Go Back
          </Button>
        </Link>
      </div>
    </div>
  );
}
