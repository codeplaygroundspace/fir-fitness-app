'use client'

import { Button } from '@/components/ui/button'
import { CollapsibleBox } from '@/components/common/collapsible-box'
import { useImbalanceImage } from '@/hooks/use-imbalance-image'
import { ImageError, ImageLoading, ImagePlaceholder } from '@/components/common/image-states'
import { useTrainingDays } from '@/hooks/use-training-days'
import Image from 'next/image'
import Link from 'next/link'

export default function RecoverPage() {
  const { imageUrl, loading: imageLoading, error: imageError } = useImbalanceImage()
  const { days, loading: daysLoading, error: daysError } = useTrainingDays('recover')

  return (
    <div className="container mx-auto px-4 py-6">
      <h1>Recover</h1>

      <CollapsibleBox title="Objective: Stretch Functional Imbalances Most" defaultOpen={false}>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Only stretch the muscles that you have just worked in &ldquo;Strengthen&rdquo;, focusing
            most on your muscles with a higher Functional Imbalances Risk (FIR). Stretching will
            help these muscles to recover quicker, which will help you feel fresher and move better,
            leading to better results in your next training session. Hold each stretch for 20sec+.
            Breathe deeply and push further into each stretch every time you breathe out.
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
            have just worked in &ldquo;Strengthen&rdquo;. Therefore please follow the same Training
            Day that you did in &ldquo;Strengthen&rdquo; (i.e. follow Day 1 Strength Training with
            Day 1 Recovery Training). If you did &ldquo;Create your own workout&rdquo; in
            &ldquo;Strengthen&rdquo; then please stretch the muscles that you have just worked,
            focusing most on stretching your muscles with a higher FIR.
          </p>
        </div>
      </CollapsibleBox>

      {daysLoading ? (
        <div className="space-y-4 mt-6">
          <div className="h-12 bg-muted animate-pulse rounded" />
          <div className="h-12 bg-muted animate-pulse rounded" />
        </div>
      ) : daysError ? (
        <div className="mt-6 text-center text-red-500">
          <p>Error loading training days</p>
        </div>
      ) : days.length > 0 ? (
        <div className="space-y-4 mt-6">
          {days.includes(1) && (
            <Button asChild variant="outline" className="w-full">
              <Link href="/recover/day/1">
                <p className="text-lg">Day 1</p>
              </Link>
            </Button>
          )}
          {days.includes(2) && (
            <Button asChild variant="outline" className="w-full">
              <Link href="/recover/day/2">
                <p className="text-lg">Day 2</p>
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="mt-6 text-center text-muted-foreground">
          <p>No recovery days assigned yet. Please contact your trainer to set up your recovery program.</p>
        </div>
      )}
    </div>
  )
}
