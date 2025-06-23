'use client'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { CollapsibleBox } from '@/components/common/collapsible-box'
import { useImbalanceImage } from '@/hooks/use-imbalance-image'
import { useTrainingDays } from '@/hooks/use-training-days'
import { ImageError, ImageLoading, ImagePlaceholder } from '@/components/common/image-states'

export default function StrengthenPage() {
  const { imageUrl, loading: imageLoading, error: imageError } = useImbalanceImage()
  const { days, loading: daysLoading, error: daysError } = useTrainingDays()

  return (
    <div className="container mx-auto px-4 py-6">
      <h1>Strengthen</h1>

      <CollapsibleBox title="Objective: Strengthen functional imbalances most" defaultOpen={false}>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Only stretch the muscles that you have just worked in "Strengthen", focusing most on
            your muscles with a higher Functional Imbalances Risk (FIR). Stretching will help these
            muscles to recover quicker, which will help you feel fresher and move better, leading to
            better results in your next training session. Hold each stretch for 20sec+. Breathe
            deeply and push further into each stretch every time you breathe out.
          </p>
        </div>
      </CollapsibleBox>

      <div className="mb-8 aspect-[4/3] grid place-items-center bg-muted/30 rounded-lg overflow-hidden">
        {imageLoading ? (
          <ImageLoading />
        ) : imageError ? (
          <ImageError message={imageError} />
        ) : !imageUrl ? (
          <ImagePlaceholder />
        ) : (
          <Image
            src={imageUrl}
            alt="Personal imbalance image"
            width={600}
            height={450}
            className="w-full h-full object-cover"
            priority
          />
        )}
      </div>

      <CollapsibleBox title="Training days" defaultOpen={false}>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Your Recovery Training Program has been split into Day 1 and Day 2. Each Day will focus
            on stretching a different combination of muscles groups that matches the muscles you
            have just worked in "Strengthen". Therefore please follow the same Training Day that you
            did in "Strengthen" (i.e. follow Day 1 Strength Training with Day 1 Recovery Training).
            If you did "Create your own workout" in "Strengthen" then please stretch the muscles
            that you have just worked, focusing most on stretching your muscles with a higher FIR.
          </p>
        </div>
      </CollapsibleBox>

      {daysLoading ? (
        <div className="space-y-4 mt-6">
          <div className="h-10 bg-muted animate-pulse rounded-lg" />
          <div className="h-10 bg-muted animate-pulse rounded-lg" />
        </div>
      ) : daysError ? (
        <div className="mt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{daysError}</AlertDescription>
          </Alert>
        </div>
      ) : days.length > 0 ? (
        <div className="space-y-4 mt-6">
          {days.map(day => (
            <Button key={day} asChild variant="outline" className="w-full">
              <Link href={`/strengthen/day/${day}`}>
                <p className="text-lg">Day {day}</p>
              </Link>
            </Button>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <Alert>
            <AlertDescription>No training days have been assigned yet.</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="mt-4">
        <Button asChild className="w-full">
          <Link href="/strengthen/create-your-own">Create your own workout</Link>
        </Button>
      </div>
    </div>
  )
}
