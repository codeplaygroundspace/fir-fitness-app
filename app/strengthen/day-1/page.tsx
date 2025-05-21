'use client'

import { BackButton } from '@/components/layout/back-button'

export default function Day1Page() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <BackButton href="/strengthen" />
      </div>
      <h1>Day 1 Workout</h1>
    </div>
  )
}
