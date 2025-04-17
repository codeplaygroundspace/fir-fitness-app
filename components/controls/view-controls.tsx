import { LayoutToggleButton } from "./layout-toggle-button"
import { ShuffleButton } from "./shuffle-button"

type ViewControlsProps = {
  isSingleColumn: boolean
  onToggleLayout: () => void
  onShuffle: () => void
  shuffleDisabled?: boolean
}

export const ViewControls = ({
  isSingleColumn,
  onToggleLayout,
  onShuffle,
  shuffleDisabled = false,
}: ViewControlsProps) => {
  return (
    <div className="flex gap-2">
      <LayoutToggleButton 
        isSingleColumn={isSingleColumn} 
        onToggle={onToggleLayout} 
      />
      <ShuffleButton 
        onShuffle={onShuffle} 
        disabled={shuffleDisabled} 
      />
    </div>
  )
} 