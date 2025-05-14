import { cn } from "@/lib/utils"

interface UserAvatarProps {
  email: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function UserAvatar({ email, className, size = "md" }: UserAvatarProps) {
  // Extract first letter of email and make it uppercase
  const firstLetter = email && email.length > 0 ? email[0].toUpperCase() : "U"

  // Determine size classes
  const sizeClasses = {
    sm: "w-10 h-10 text-xl",
    md: "w-20 h-20 text-4xl",
    lg: "w-32 h-32 text-6xl",
  }

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden flex items-center justify-center bg-primary/20 font-bold text-primary",
        sizeClasses[size],
        className,
      )}
    >
      {firstLetter}
    </div>
  )
}
