// This file centralizes all exercise data for the app

export type Exercise = {
  id: number
  name: string
  image: string
  duration?: string
  type: "warmup" | "stretch" | "fit"
  instructions?: string
}

export const exercises: Exercise[] = [
  // Warmup exercises
  {
    id: 2,
    name: "Walkouts",
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F35%2F2019%2F08%2F26155912%2Fcomplete-abs-workout-walk-out.jpg&f=1&nofb=1&ipt=ae5786714042e65546c871148715c8d1b5ba7edb187be3806fcd7a615e245f37&ipo=images",
    duration: "30 sec",
    type: "warmup",
  },
  {
    id: 3,
    name: "Plank lunge & Rotate",
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FIpwF9Sb-3cw%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=7846d8affe9c7554e0f105bcbdda028635b007a1d801a167305bf596a701d36b&ipo=images",
    duration: "30 sec",
    type: "warmup",
  },
  {
    id: 4,
    name: "Supermans",
    image:
      "https://sjc.microlink.io/-NXHQcvWlneUaSc_ccp58mVWJmsCaqi3XR_wPphSs_yBNxW58-8xLeFvPPN3U1sBuRdjKAKxbh_h0pbIUS0xyw.jpeg",
    duration: "30 sec",
    type: "warmup",
  },
  {
    id: 5,
    name: "Deadbug",
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.self.com%2Fphotos%2F580a37dc7f7be8915ea98685%2Fmaster%2Fw_1600%252Cc_limit%2Fdead-bug_ab-stacked.jpg&f=1&nofb=1&ipt=93c24ae5a5cdc1b67be3d3506fd69d36268e63215e6f26bafdbb3f6e73fd98fb&ipo=images",
    duration: "30 sec",
    type: "warmup",
  },
  {
    id: 6,
    name: "Crabs pushes",
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F43%2F78%2F14%2F437814329bbcb9d2cdc3aa8ec10eae90.jpg&f=1&nofb=1&ipt=e464613c2bde87112adb1817596ff1580f3786ef12c4ae33e9a5557dc0fb2568&ipo=images",
    duration: "30 sec",
    type: "warmup",
  },
  {
    id: 7,
    name: "Side lunges",
    image:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn-0.weighttraining.guide%2Fwp-content%2Fuploads%2F2022%2F11%2FDumbbell-side-lunge.png%3Fezimgfmt%3Dng%3Awebp%252Fngcb4&f=1&nofb=1&ipt=9a98dbf5d6a7854a2ab37c58c3a91ec750733f56c125cfda25855f151170dd29&ipo=images",
    duration: "30 sec",
    type: "warmup",
  },

  // Stretch exercises
  { id: 101, name: "Wrist and Forearm", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 102, name: "Bicep", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 103, name: "Triceps", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 104, name: "Chest", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 105, name: "Neck", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 106, name: "Shoulder & Rotator Cuff", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 107, name: "Back (Upper)", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 108, name: "Lats", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 109, name: "Obliques", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 110, name: "Hip (Flexors) & Abs", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 111, name: "Back (Lower)", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 112, name: "Hip (Outside)", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 113, name: "Glutes", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 114, name: "Hip (Inside), Groin", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 115, name: "Quads", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 116, name: "Hamstring", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 117, name: "Shin", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 118, name: "Calf", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
  { id: 119, name: "Feet", image: "/placeholder.svg?height=200&width=300", type: "stretch" },
]

export const getExerciseById = (id: number): Exercise | undefined => {
  return exercises.find((exercise) => exercise.id === id)
}

export const getExercisesByType = (type: "warmup" | "stretch" | "fit"): Exercise[] => {
  return exercises.filter((exercise) => exercise.type === type)
}

