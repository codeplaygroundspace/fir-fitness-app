"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    profilePicture: "/placeholder.svg?height=100&width=100",
    workoutHistory: [
      { date: "2023-03-15", type: "FIT", duration: "45 min" },
      { date: "2023-03-13", type: "Stretch", duration: "30 min" },
      { date: "2023-03-10", type: "Warmup", duration: "20 min" },
    ],
    fitnessLevel: "Intermediate",
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <ThemeToggle />
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <Image src={user.profilePicture || "/placeholder.svg"} alt={user.name} fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm mt-1">Fitness Level: {user.fitnessLevel}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Workout History</h2>
        <div className="space-y-2">
          {user.workoutHistory.map((workout, index) => (
            <div key={index} className="p-3 bg-muted rounded-lg flex justify-between">
              <div>
                <p className="font-medium">{workout.type}</p>
                <p className="text-sm text-muted-foreground">{workout.date}</p>
              </div>
              <div>
                <p className="text-sm">{workout.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Settings & Preferences</h2>
        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Notification Settings
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Privacy Settings
          </Button>
          <Button variant="outline" className="w-full justify-start">
            App Preferences
          </Button>
          <Button variant="outline" className="w-full justify-start text-destructive">
            Log Out
          </Button>
        </div>
      </section>
    </div>
  )
}

