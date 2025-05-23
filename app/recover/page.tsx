'use client'

import { Button } from '@/components/ui/button'
import { CollapsibleBox } from '@/components/common/collapsible-box'
import Link from 'next/link'

export default function RecoverPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1>Recover</h1>

      <CollapsibleBox title="Recovery Guide" defaultOpen={false}>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Recovery is just as important as the workout itself. Focus on gentle movements that
            promote blood flow and help your muscles recover. This will help reduce soreness and
            prepare your body for your next workout session.
          </p>
        </div>
      </CollapsibleBox>

      <div className="space-y-4 mt-6">
        <Button asChild variant="outline" className="w-full">
          <Link href="/recover/day/1">
            <p className="text-lg">Day 1</p>
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/recover/day/2">
            <p className="text-lg">Day 2</p>
          </Link>
        </Button>
      </div>

      <div className="mt-4">
        <Button asChild className="w-full">
          <Link href="/recover/create-your-own">Create your own workout</Link>
        </Button>
      </div>
    </div>
  )
}
