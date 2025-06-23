'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface ExerciseVideoProps {
  exerciseName: string
  videoUrl?: string | null
  videoUrl2?: string | null
  videoUrl3?: string | null
}

// Helper function to convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string | null): string | null {
  if (!url) return null

  // Check if it's already an embed URL
  if (url.includes('youtube.com/embed/')) return url

  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url?.match(regExp)

  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null
}

// Component to render a single video
function VideoPlayer({ url, title }: { url: string | null; title: string }) {
  const embedUrl = getYouTubeEmbedUrl(url)

  if (!embedUrl) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Video Unavailable</AlertTitle>
        <AlertDescription>
          The video for this exercise is currently private or unavailable. Please check back later.
        </AlertDescription>
      </Alert>
    )
  }
  return (
    <div className="aspect-video rounded-lg overflow-hidden">
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  )
}

export function ExerciseVideo({
  exerciseName,
  videoUrl,
  videoUrl2,
  videoUrl3,
}: ExerciseVideoProps) {
  // Create array of available videos with their metadata
  const videos = [
    { url: videoUrl, key: 'video1', label: 'Video 1' },
    { url: videoUrl2, key: 'video2', label: 'Video 2' },
    { url: videoUrl3, key: 'video3', label: 'Video 3' },
  ].filter(video => video.url) as Array<{ url: string; key: string; label: string }>

  if (videos.length === 0) {
    return null
  }

  if (videos.length === 1) {
    return (
      <div className="mb-6">
        <VideoPlayer url={videos[0].url} title={`${exerciseName} tutorial`} />
      </div>
    )
  }

  return (
    <div className="mb-6">
      <div className="space-y-6">
        {videos.map((video, index) => (
          <div key={video.key}>
            <VideoPlayer url={video.url} title={`${exerciseName} tutorial - ${video.label}`} />
          </div>
        ))}
      </div>
    </div>
  )
}
