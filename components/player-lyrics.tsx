import type { LyricLine } from "../types/music"

interface PlayerLyricsProps {
  lyrics: LyricLine[]
  currentLyricIndex: number
  textColor: string
  textColorFaded: string
  isLoading: boolean
}

export function PlayerLyrics({ lyrics, currentLyricIndex, textColor, textColorFaded, isLoading }: PlayerLyricsProps) {
  return (
    <div className="mb-8 h-[160px] lg:h-[400px] overflow-hidden relative">
      {isLoading ? (
        <p className={`h-full flex items-center justify-center ${textColorFaded}`}>加载歌词中...</p>
      ) : lyrics.length > 0 ? (
        <div
          className="absolute w-full transition-transform duration-300 ease-out"
          style={{
            transform: `translateY(${Math.max(
              (window.innerWidth >= 1024 ? 200 : 80) - currentLyricIndex * 40,
              -(lyrics.length * 40 - (window.innerWidth >= 1024 ? 400 : 160)),
            )}px)`,
          }}
        >
          {lyrics.map((line, index) => (
            <p
              key={index}
              className={`h-[40px] flex items-center justify-center text-lg lg:text-xl transition-all duration-300 ${
                index === currentLyricIndex
                  ? `font-bold ${textColor} scale-110`
                  : `${textColorFaded} scale-100 opacity-70`
              }`}
            >
              {line.text}
            </p>
          ))}
        </div>
      ) : (
        <p className={`h-full flex items-center justify-center text-lg lg:text-xl ${textColorFaded}`}>未在播放</p>
      )}
    </div>
  )
}

