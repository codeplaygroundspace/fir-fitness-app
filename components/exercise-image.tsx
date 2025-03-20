"use client"

import Image from "next/image"
import { useState } from "react"

interface ExerciseImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export default function ExerciseImage({ src, alt, width = 300, height = 200, className = "" }: ExerciseImageProps) {
  const [isError, setIsError] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <Image
        src={isError ? `/placeholder.svg?height=${height}&width=${width}` : src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover dark:brightness-90"
        onError={() => setIsError(true)}
        unoptimized={!src.startsWith("/")} // Skip optimization for external URLs
      />
    </div>
  )
}

