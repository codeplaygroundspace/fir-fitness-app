import { Badge } from '@/components/ui/badge'

interface CategoryLabelProps {
  category: string
}

export function CategoryLabel({ category }: CategoryLabelProps) {
  return (
    <Badge variant="secondary" className="text-xs px-2 py-1 mr-1 mb-1">
      {category}
    </Badge>
  )
}
