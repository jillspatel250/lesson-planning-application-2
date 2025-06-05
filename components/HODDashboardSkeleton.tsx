"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, Users } from "lucide-react";

export function HODDashboardSkeleton() {
  return (
    <div className="animate-pulse px-5 pt-3">
      {/* Header skeleton */}
      <div className="flex justify-between items-center px-5 py-3 border-2 rounded-lg">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-10 w-[180px]" />
      </div>

      {/* Institute/Department info skeleton */}
      <div className="flex flex-col justify-around pl-5 py-2 bg-[#EBF5FF] h-[77px] rounded-[10px] border border-gray-400 mt-3">
        <Skeleton className="h-5 w-64 mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-5 gap-5 mt-3">
        <div className="flex items-center justify-between px-5 border rounded-lg border-black h-20">
          <div className="flex flex-col justify-between h-14">
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-8 w-8" />
          </div>
          <Users className="size-11 text-gray-300" />
        </div>
        <div className="flex items-center justify-between px-5 border rounded-lg border-black h-20">
          <div className="flex flex-col justify-between h-14">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-8 w-8" />
          </div>
          <BookOpen className="size-11 text-gray-300" />
        </div>
      </div>

      {/* Faculty Management section skeleton */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="border rounded-lg border-black p-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
          <hr className="border-1 border-black mt-3" />
          <div className="mt-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[28%]">Name</TableHead>
                  <TableHead className="w-[45%]">Email</TableHead>
                  <TableHead className="w-[19%]">Subjects</TableHead>
                  <TableHead className="w-[10%]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(5).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-9" />
                        <Skeleton className="h-9 w-9" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Subject Details section skeleton */}
        <div className="border rounded-lg border-black p-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <hr className="border-1 border-black mt-3" />
          <div className="mt-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[55%]">Name</TableHead>
                  <TableHead className="w-[15%]">Code</TableHead>
                  <TableHead className="w-[16%]">Semester</TableHead>
                  <TableHead className="w-[48%]">Abbreviation</TableHead>
                  <TableHead className="w-[10%]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array(5).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell>
                      <Skeleton className="h-9 w-9" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}