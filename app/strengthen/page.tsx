'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CollapsibleBox } from '@/components/common/collapsible-box'

export default function StrengthenPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1>Strengthen</h1>

      <CollapsibleBox title="Strengthening Guide" defaultOpen={false}>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Recovery is just as important as the workout itself. Focus on gentle movements that
            promote blood flow and help your muscles recover. This will help reduce soreness and
            prepare your body for your next workout session.
          </p>
        </div>
      </CollapsibleBox>

      <div className="mt-6">
        <h3>Day 1</h3>
      </div>

      <div className="mt-4">
        <h3>Day 2</h3>
      </div>

      <div className="mt-8">
        <Button asChild>
          <Link href="/strengthen/create-your-own">Create your own workout</Link>
        </Button>
      </div>
    </div>
  )
}
