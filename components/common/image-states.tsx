import { HTMLAttributes } from 'react'

interface ImageStateProps extends HTMLAttributes<HTMLDivElement> {
  message?: string
}

export function ImageError({ message = 'Failed to load image', ...props }: ImageStateProps) {
  return (
    <div role="alert" className="bg-destructive/10 p-4 rounded" {...props}>
      <p className="text-destructive">{message}</p>
    </div>
  )
}

export function ImagePlaceholder(props: ImageStateProps) {
  return (
    <div role="img" aria-label="No image available" className="text-muted-foreground" {...props}>
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  )
}

export function ImageLoading() {
  return (
    <div
      role="status"
      aria-label="Loading image"
      className="animate-spin h-12 w-12 border-3 border-primary border-t-transparent rounded-full"
    />
  )
}
