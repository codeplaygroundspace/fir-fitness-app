"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Share2, Copy, Check } from "lucide-react"
import type { ShareWorkoutProps } from "@/lib/types"

export function ShareWorkout({ exerciseId, exerciseName, exerciseType }: ShareWorkoutProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const shareUrl = `${window.location.origin}/${exerciseType === "warmup" ? "warmup" : exerciseType}/${exerciseId}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)

      toast({
        title: "Link copied!",
        description: "Share it with your friends",
      })

      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this ${exerciseType} exercise: ${exerciseName}`,
          text: `I've been doing this ${exerciseType} exercise and thought you might like it!`,
          url: shareUrl,
        })
      } catch (err) {
        console.error("Share failed:", err)
      }
    } else {
      handleCopy()
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this exercise</DialogTitle>
          <DialogDescription>Anyone with the link can view this exercise</DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2">
          <Input value={shareUrl} readOnly className="flex-1" />
          <Button size="icon" onClick={handleCopy} variant="outline">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>

        <DialogFooter>
          <Button onClick={handleShare} className="w-full sm:w-auto">
            <Share2 className="h-4 w-4 mr-2" />
            {navigator.share ? "Share" : "Copy Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

