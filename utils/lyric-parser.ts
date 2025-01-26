import type { LyricLine } from "../types/music"

export function parseLyrics(lrc: string): LyricLine[] {
  const lines = lrc.split("\n")
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

  return lines
    .map((line) => {
      const match = timeRegex.exec(line)
      if (!match) return null

      const minutes = Number.parseInt(match[1])
      const seconds = Number.parseInt(match[2])
      const milliseconds = Number.parseInt(match[3])

      const time = minutes * 60000 + seconds * 1000 + milliseconds
      const text = line.replace(timeRegex, "").trim()

      return { time, text }
    })
    .filter((line): line is LyricLine => line !== null)
    .sort((a, b) => a.time - b.time)
}

