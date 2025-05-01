'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function WorkoutPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1>Workout</h1>

      <div className="mt-6">
        <h3>Day 1</h3>
      </div>

      <div className="mt-4">
        <h3>Day 2</h3>
      </div>

      <div className="mt-8">
        <Button asChild>
          <Link href="/workout/create-your-own">Create your own workout</Link>
        </Button>
      </div>
    </div>
  )
}
