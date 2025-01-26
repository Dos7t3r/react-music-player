import { useEffect, useRef } from "react"
import type { LyricLine } from "../types/music"

interface LyricsProps {
  lyrics: LyricLine[]
  currentLyricIndex: number
  isLoading: boolean
  className?: string
}

export function Lyrics({ lyrics, currentLyricIndex, isLoading, className = "h-[400px]" }: LyricsProps) {
  const lyricsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (lyricsRef.current && currentLyricIndex >= 0) {
      const currentLyric = lyricsRef.current.children[currentLyricIndex] as HTMLElement
      if (currentLyric) {
        currentLyric.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }, [currentLyricIndex])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading ? (
        <div className="h-full flex items-center justify-center text-white/60">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : lyrics.length > 0 ? (
        <div ref={lyricsRef} className="space-y-4">
          {lyrics.map((line, index) => (
            <p
              key={index}
              className={`transition-all duration-300 ease-in-out ${
                index === currentLyricIndex
                  ? "text-xl lg:text-2xl font-bold text-white"
                  : "text-base lg:text-lg text-white/60"
              }`}
            >
              <span
                className={
                  index === currentLyricIndex
                    ? "bg-gradient-to-r from-[#ff8a00] via-[#ff0080] to-[#7928ca] text-transparent bg-clip-text bg-300% animate-gradient"
                    : ""
                }
              >
                {line.text}
              </span>
            </p>
          ))}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-white/60">暂无歌词</div>
      )}
    </div>
  )
}

