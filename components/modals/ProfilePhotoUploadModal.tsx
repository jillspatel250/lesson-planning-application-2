"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ProfilePhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentPhotoUrl?: string | null;
  onPhotoUploaded: (photoUrl: string) => void;
  onPhotoDeleted?: () => void;
}

export default function ProfilePhotoUploadModal({
  isOpen,
  onClose,
  userId,
  currentPhotoUrl,
  onPhotoUploaded,
  onPhotoDeleted,
}: ProfilePhotoUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5KB = 5 * 1024 bytes)
    if (file.size > 5 * 1024) {
      toast.error("Profile photo must be less than 5KB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const extractFileNameFromUrl = (url: string): string | null => {
    try {
      const urlParts = url.split("/");
      return urlParts[urlParts.length - 1];
    } catch {
      return null;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) return;

    setIsUploading(true);

    try {
      // Delete old photo if it exists
      if (currentPhotoUrl) {
        const oldFileName = extractFileNameFromUrl(currentPhotoUrl);
        if (oldFileName) {
          const { error: deleteError } = await supabase.storage
            .from("profile-photos")
            .remove([oldFileName]);

          if (deleteError) {
            console.warn("Could not delete old photo:", deleteError);
          }
        }
      }

      // Upload new photo
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("profile-photos")
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(fileName);

      // Update user profile in database
      const photoUrl = publicUrlData.publicUrl;
      const { error: updateError } = await supabase
        .from("users")
        .update({
          profile_photo: photoUrl,
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      toast.success("Profile photo updated successfully...");
      onPhotoUploaded(photoUrl);
      onClose();
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload profile photo. Please try again.", {
        id: "upload-toast",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const displayUrl = previewUrl || currentPhotoUrl;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#1A5CA1] font-manrope font-bold text-[22px] leading-[25px]">
            {currentPhotoUrl ? "Update Profile Photo" : "Upload Profile Photo"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center gap-4">
            {displayUrl ? (
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-blue-100">
                <Image
                  src={displayUrl || "/placeholder.svg"}
                  alt="Profile photo preview"
                  fill
                  className="object-cover"
                  crossOrigin="anonymous"
                />
              </div>
            ) : (
              <div className="h-32 w-32 pl-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                No photo selected
              </div>
            )}

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="photo">
                {currentPhotoUrl ? "Select New Photo" : "Select Photo"}
              </Label>
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading || isDeleting}
              />
              <p className="text-xs text-gray-500">
                Photo must be less than 5KB
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isUploading || isDeleting}
              >
                Cancel
              </Button>
            </div>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || isDeleting}
              className="bg-[#1A5CA1] hover:bg-[#1A5CA1]/90"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {currentPhotoUrl ? "Updating..." : "Uploading..."}
                </>
              ) : currentPhotoUrl ? (
                "Update Photo"
              ) : (
                "Upload Photo"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
