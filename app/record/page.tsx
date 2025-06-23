'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/components/auth/auth-provider'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { UserAvatar } from '@/components/record/user-avatar'
import { GoalNotesForm } from '@/components/record/goal-notes-form'
import { LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ImageError, ImageLoading, ImagePlaceholder } from '@/components/common/image-states'
import { useImbalanceImage } from '@/hooks/use-imbalance-image'
import { getUserGoalNotes, type GoalNotes } from '@/app/record/actions'

export default function RecordPage() {
  const { user, signOut } = useAuth()
  const [goalNotes, setGoalNotes] = useState<GoalNotes>({
    pain: '',
    posture: '',
    performance: '',
    physique: '',
  })
  const [goalNotesLoading, setGoalNotesLoading] = useState(true)
  const { imageUrl, loading: imageLoading, error: imageError } = useImbalanceImage()

  // Load user's goal notes
  useEffect(() => {
    if (!user?.id) {
      setGoalNotesLoading(false)
      return
    }

    async function loadGoalNotes() {
      try {
        if (!user?.id) return
        const notes = await getUserGoalNotes(user.id)
        setGoalNotes(notes)
      } catch (error) {
        console.error('Error loading goal notes:', error)
      } finally {
        setGoalNotesLoading(false)
      }
    }

    loadGoalNotes()
  }, [user?.id])

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

          <GoalNotesForm
            userId={user?.id}
            initialGoalNotes={goalNotes}
            isLoading={goalNotesLoading}
          />
        </div>

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
