"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// Update imports for moved components
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { WeeklyProgress } from "@/components/profile/weekly-progress"
import { MonthlyCalendar } from "@/components/profile/monthly-calendar"
import { useAuth } from "@/components/auth/auth-provider"
import { LogOut } from "lucide-react"
import { WorkoutProvider } from "@/contexts/workout-context"
import { useState } from "react"
import { UserAvatar } from "@/components/profile/user-avatar"

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const [error, setError] = useState<string | null>(null)

  // Use user data from Supabase auth
  const userData = {
    name: user?.email?.split("@")[0] || "Fitness User",
    email: user?.email || "user@example.com",
    profilePicture: "/placeholder.svg?height=100&width=100",
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" id="profile-heading">
          Profile
        </h1>
        <ThemeToggle />
      </header>

      <main aria-labelledby="profile-heading">
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
          <WorkoutProvider>
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
          </WorkoutProvider>
        )}

        <section aria-labelledby="account-heading">
          <h2 id="account-heading" className="text-xl font-semibold mb-4">
            Account
          </h2>
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

