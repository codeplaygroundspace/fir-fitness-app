import { LayoutToggleButton } from "./layout-toggle-button"

type ViewControlsProps = {
  isSingleColumn: boolean
  onToggleLayout: () => void
}

export const ViewControls = ({
  isSingleColumn,
  onToggleLayout,
}: ViewControlsProps) => {
  return (
    <div className="flex gap-2">
      <LayoutToggleButton 
        isSingleColumn={isSingleColumn} 
        onToggle={onToggleLayout} 
      />
    </div>
  )
} 