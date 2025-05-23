'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/components/auth/auth-provider'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { MonthlyCalendar } from '@/components/record/monthly-calendar'
import { UserAvatar } from '@/components/record/user-avatar'
import { WeeklyProgress } from '@/components/record/weekly-progress'
import { RecordProvider } from '@/contexts/record-context'
import { LogOut } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import { ImageError, ImageLoading, ImagePlaceholder } from '@/components/common/image-states'
import { useImbalanceImage } from '@/hooks/use-imbalance-image'

export default function RecordPage() {
  const { user, signOut } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const { imageUrl, loading: imageLoading, error: imageError } = useImbalanceImage()

  // Use user data from Supabase auth
  const userData = {
    name: user?.email?.split('@')[0] || 'Fitness User',
    email: user?.email || 'user@example.com',
    profilePicture: '/placeholder.svg?height=100&width=100',
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" id="profile-heading">
          Record
        </h1>
        <ThemeToggle />
      </header>

      <main aria-labelledby="profile-heading">
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

        <div className="mb-8">
          <h2 className="text-xl font-semibold">Write your own notes</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Write your goals that are important to you under the following headings
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Pain</h3>
              <Input
                placeholder="Write your pain-related goals here..."
                className="w-full bg-background"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Posture</h3>
              <Input
                placeholder="Write your posture-related goals here..."
                className="w-full bg-background"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Performance</h3>
              <Input
                placeholder="Write your performance-related goals here..."
                className="w-full bg-background"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Physique</h3>
              <Input
                placeholder="Write your physique-related goals here..."
                className="w-full bg-background"
              />
            </div>
          </div>
        </div>

        {error ? (
          <Card className="mb-6 border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Error Loading Workout Data</h3>
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <RecordProvider>
            {/* Weekly Progress */}
            <section className="mb-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <WeeklyProgress />
                </CardContent>
              </Card>
            </section>

            {/* Monthly Calendar */}
            <section className="mb-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <MonthlyCalendar />
                </CardContent>
              </Card>
            </section>
          </RecordProvider>
        )}

        <section aria-labelledby="account-heading">
          <h2 id="account-heading" className="text-xl font-semibold mb-4">
            Account
          </h2>

          <Card className="mb-6 border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <UserAvatar email={userData.email} size="md" />
                <div>
                  <h2 className="text-xl font-semibold">{userData.name}</h2>
                  <p className="text-muted-foreground">{userData.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:bg-destructive/10 focus:ring-destructive"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" aria-hidden="true" />
              <span>Log Out</span>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}
