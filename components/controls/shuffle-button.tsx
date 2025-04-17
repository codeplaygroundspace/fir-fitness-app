import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"

type ShuffleButtonProps = {
  onShuffle: () => void
  disabled?: boolean
}

export const ShuffleButton = ({
  onShuffle,
  disabled = false,
}: ShuffleButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onShuffle}
      className="flex items-center gap-1"
      disabled={disabled}
    >
      <Shuffle className="h-4 w-4" />
      Shuffle
    </Button>
  )
} 