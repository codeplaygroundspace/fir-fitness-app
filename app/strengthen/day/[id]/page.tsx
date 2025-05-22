'use client'

import { useTrainingDays } from '@/hooks/use-training-days'
import { useAuth } from '@/components/auth/auth-provider'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ImageError, ImageLoading, ImagePlaceholder } from '@/components/common/image-states'
import { useDayImage } from '@/hooks/use-day-image'
import { useState, useEffect } from 'react'
import { CollapsibleBox } from '@/components/common/collapsible-box'

export default function DayPage() {
  const params = useParams()
  const router = useRouter()
  const dayId = Number(params.id)
  const { user } = useAuth()
  const { days, loading: daysLoading } = useTrainingDays()
  const { imageUrl, loading, error } = useDayImage(user?.id, dayId)

  // Verify user has access to this day
  useEffect(() => {
    if (!daysLoading && dayId && !days.includes(dayId)) {
      router.push('/strengthen')
    }
  }, [dayId, days, daysLoading, router])

  // Verify this day is assigned to the user
  const isAssigned = !daysLoading && days.includes(dayId)

  if (!dayId || isNaN(dayId)) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Invalid day</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-0 md:px-4 py-0 md:py-6">
      {/* Feature image with back button */}
      <div className="relative w-full">
        <div className="absolute top-4 left-4 z-10">
          <Link href="/strengthen">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="mb-8 aspect-[4/3] grid place-items-center bg-muted/30 overflow-hidden">
          {loading ? (
            <ImageLoading />
          ) : error ? (
            <ImageError message={error} />
          ) : !imageUrl ? (
            <ImagePlaceholder />
          ) : (
            <Image
              src={imageUrl}
              alt={`Day ${dayId} workout`}
              width={800}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          )}
        </div>
      </div>

      <div className="px-4">
        <h1>Day {dayId} Workout</h1>
        <CollapsibleBox title="Exercises" defaultOpen={false}>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Below is a list of exercise which altogether will work the muscles highlighted above
              for Day 1. Click on the 'Exercise picture' to see full technique video. Click on the
              'Muscle picture' to view exercise alternatives. Write in 'Notes' any info important to
              you (e.g. Technique reminders, reps/sets/weight).
            </p>
          </div>
        </CollapsibleBox>
      </div>
    </div>
  )
}
