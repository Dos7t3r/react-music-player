"use client"

import { useEffect, useRef, useState } from "react"
import { Play, Pause } from "lucide-react"

interface AudioPlayerProps {
  url?: string
  onTimeUpdate?: (currentTime: number) => void
  onEnded?: () => void
  onError?: () => void
}

export function AudioPlayer({ url, onTimeUpdate, onEnded, onError }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }, [audioRef]) // Updated dependency

  function handleTimeUpdate() {
    if (audioRef.current) {
      const time = audioRef.current.currentTime
      setCurrentTime(time)
      onTimeUpdate?.(time)
    }
  }

  function handleLoadedMetadata() {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  function togglePlay() {
    setIsPlaying(!isPlaying)
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    if (!audioRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  function formatTime(time: number) {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="w-full">
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false)
          onEnded?.()
        }}
        onError={() => {
          setIsPlaying(false)
          onError?.()
        }}
      />

      <div className="space-y-4">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer" onClick={handleSeek}>
          <div
            className="h-full bg-white/80 transition-all duration-100"
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-white/60">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <div className="flex justify-center items-center">
          <button className="text-white/80 hover:text-white disabled:opacity-50" onClick={togglePlay} disabled={!url}>
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </button>
        </div>
      </div>
    </div>
  )
}

