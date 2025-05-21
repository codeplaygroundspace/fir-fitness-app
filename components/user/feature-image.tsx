'use client'

import Image from 'next/image'

interface FeatureImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export function FeatureImage({
  src,
  alt,
  width = 400,
  height = 600,
  className = 'w-auto h-auto max-h-[500px] object-contain',
}: FeatureImageProps) {
  return (
    <section className="mb-8">
      <div className="rounded-lg overflow-hidden shadow-md">
        <div className="flex justify-center">
          <Image src={src} alt={alt} width={width} height={height} className={className} priority />
        </div>
      </div>
    </section>
  )
}
