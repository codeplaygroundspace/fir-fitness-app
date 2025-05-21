'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CollapsibleBox } from '@/components/common/collapsible-box'
import { FeatureImage } from '@/components/user/feature-image'

export default function StrengthenPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1>Strengthen</h1>

      <CollapsibleBox title="Objective: Strengthen functional imbalances most" defaultOpen={false}>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Your goal is to work all the muscles in your body, focusing most on strengthening your
            muscles with a higher Functional Imbalances Risk (FIR). This will help you to get better
            results from your training.
          </p>
        </div>
      </CollapsibleBox>

      <FeatureImage
        src="https://live.staticflickr.com/65535/54398757288_bca1273e3a_w.jpg"
        alt="Muscles stretching"
      />

      <CollapsibleBox title="Training days" defaultOpen={false}>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Your Strength training program has been split into Day 1 and Day 2. Each Day will focus
            on working a different combination of muscles groups. Please follow the training Days in
            order(i.e. follow Day 1 training with Day 2 training, then go back to Day 1) to ensure
            that you keep to the ideal FIR training ratios calculated for your body. If for any
            reason you are unable to do Day 1 or 2 training, you can 'Create your own workout'.
          </p>
        </div>
      </CollapsibleBox>

      <div className="mt-6">
        <Button asChild variant="outline" className="w-full">
          <Link href="/strengthen/day-1">
            <p className="text-lg">Day 1</p>
          </Link>
        </Button>
      </div>

      <div className="mt-4">
        <Button asChild variant="outline" className="w-full">
          <Link href="/strengthen/day-2">
            <p className="text-lg">Day 2</p>
          </Link>
        </Button>
      </div>

      <div className="mt-4">
        <Button asChild className="w-full">
          <Link href="/strengthen/create-your-own">Create your own workout</Link>
        </Button>
      </div>
    </div>
  )
}
