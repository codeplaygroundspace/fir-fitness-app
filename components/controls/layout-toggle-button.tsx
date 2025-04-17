import { Button } from "@/components/ui/button"
import { LayoutGrid, LayoutList } from "lucide-react"

type LayoutToggleButtonProps = {
  isSingleColumn: boolean
  onToggle: () => void
}

export const LayoutToggleButton = ({
  isSingleColumn,
  onToggle,
}: LayoutToggleButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="flex items-center gap-1"
    >
      {isSingleColumn ? (
        <LayoutGrid className="h-4 w-4" />
      ) : (
        <LayoutList className="h-4 w-4" />
      )}
      {isSingleColumn ? 'Grid' : 'List'}
    </Button>
  )
} 