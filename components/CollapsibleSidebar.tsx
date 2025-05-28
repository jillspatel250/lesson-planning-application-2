"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, User, LogOut, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { useDashboardContext } from "@/context/DashboardContext";

export default function CollapsibleSidebar({ signOut }: { signOut: () => void }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { userData, currentRole } = useDashboardContext();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={`${
          isCollapsed ? "w-20" : "w-64"
        } bg-white shadow-md flex flex-col h-screen relative transition-all duration-300`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <Avatar className="h-10 w-10">
              {userData.profile_photo ? (
                <Image
                  src={userData.profile_photo}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              )}
            </Avatar>
            {!isCollapsed && (
              <div className="pt-1">
                <p className="text-[#1A5CA1] font-manrope font-bold text-[20px] leading-[25px]">
                  {userData.name}
                </p>
                <p className="font-manrope font-semibold text-[15px] leading-[25px]">
                  {currentRole.role_name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-16 p-1.5 rounded-full bg-white shadow-md border text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {/* Navigation */}
        <nav className="mt-5 px-2 flex-grow">
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard"
                  className="group flex items-center px-3 py-2 text-base leading-6 font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150 justify-center"
                >
                  <Home className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-manrope">Home</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/dashboard"
              className="group flex items-center px-3 py-2 text-base leading-6 font-medium rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150"
            >
              <Home className="h-5 w-5 text-gray-400 group-hover:text-gray-500 mr-3" />
              Home
            </Link>
          )}
        </nav>

        {/* Footer */}
        <div className="px-2 mb-4">
          <Separator className="my-2" />
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={signOut}
                  variant="ghost"
                  className="w-full bg-black text-white hover:bg-black hover:text-white cursor-pointer px-2 justify-center"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              onClick={signOut}
              variant="ghost"
              className="w-full bg-black/85 text-white hover:bg-black hover:text-white cursor-pointer"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}