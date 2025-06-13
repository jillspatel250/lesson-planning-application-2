"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@supabase/supabase-js"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface ProfilePhotoUploadModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onPhotoUploaded: (photoUrl: string) => void
}

export default function ProfilePhotoUploadModal({
  isOpen,
  onClose,
  userId,
  onPhotoUploaded,
}: ProfilePhotoUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (5KB = 5 * 1024 bytes)
    if (file.size > 5 * 1024) {
      toast("Profile photo must be less than 5KB")
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !userId) return
    console.log(userId)

    setIsUploading(true)
    toast("This process may take a few seconds...")
    try {
      // Upload to Supabase Storage
      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const { data, error } = await supabase.storage.from("profile-photos").upload(fileName, selectedFile)

      if (error) throw error

      // Get public URL
      const { data: publicUrlData } = supabase.storage.from("profile-photos").getPublicUrl(fileName)

      // Update user profile in database
      const photoUrl = publicUrlData.publicUrl
      const { error: updateError } = await supabase.from("users").update({ profile_photo: photoUrl }).eq("id", userId)

      if (updateError) throw updateError

      toast("Profile photo uploaded successfully...")
      onPhotoUploaded(photoUrl)
      onClose()
    } catch (error) {
      console.error("Error uploading photo:", error)
      toast("Error occured while uploading profile photo !!")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#1A5CA1] font-manrope font-bold text-[22px] leading-[25px]">Upload Profile Photo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center gap-4">
            {previewUrl ? (
              <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-blue-100">
                <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
              </div>
            ) : (
              <div className="h-32 w-32 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                No photo selected
              </div>
            )}

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="photo">Select Photo</Label>
              <Input id="photo" type="file" accept="image/*" onChange={handleFileChange} />
              <p className="text-xs text-gray-500">Photo must be less than 5KB</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-between w-full">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="bg-[#1A5CA1] hover:bg-[#1A5CA1]/90"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Photo"
            )}
          </Button></div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
