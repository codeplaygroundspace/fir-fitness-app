"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import type { ExerciseImageProps } from "@/lib/types"

export default function ExerciseImage({ src, alt, width = 300, height = 200, className = "" }: ExerciseImageProps) {
  const [isError, setIsError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)

  // Reset error state if src changes
  useEffect(() => {
    setIsError(false)
    setImageSrc(src)
  }, [src])

  const handleError = () => {
    console.log(`Image failed to load: ${src}`)
    setIsError(true)
    setImageSrc(`/placeholder.svg?height=${height}&width=${width}`)
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover dark:brightness-90"
        onError={handleError}
        unoptimized={!imageSrc.startsWith("/")} // Keep this if needed for external URLs
      />
    </div>
  )
}
