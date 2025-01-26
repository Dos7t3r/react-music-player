import { Repeat, Shuffle, SkipBack, Play, Pause, SkipForward, Volume2, Download } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface PlayerControlsProps {
  isPlaying: boolean
  onPlayPause: () => void
  onPrevious: () => void
  onNext: () => void
  currentTime: number
  duration: number
  volume: number
  onVolumeChange: (value: number) => void
  onSeek: (value: number) => void
  onDownload: () => void
  downloadProgress: number | null
  showNotification: (message: string) => void
}

export function PlayerControls({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  currentTime,
  duration,
  volume,
  onVolumeChange,
  onSeek,
  onDownload,
  downloadProgress,
  showNotification,
}: PlayerControlsProps) {
  function formatTime(time: number) {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  function handleDownload() {
    onDownload()
    showNotification("开始下载")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-orange-500/20 bg-black/30 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm min-w-[40px]">{formatTime(currentTime)}</span>
            <div
              className="relative flex-1 h-1 bg-white/20 rounded-full overflow-visible cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const percent = (e.clientX - rect.left) / rect.width
                onSeek(percent * duration)
              }}
            >
              <div
                className="absolute h-full bg-gradient-to-r from-[#ff8a00] via-[#ff0080] to-[#7928ca] transition-all duration-100 group-hover:opacity-80"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              >
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform"
                  style={{
                    transform: `translateY(-50%) ${currentTime > 0 ? "scale(1)" : "scale(0)"}`,
                  }}
                />
              </div>
            </div>
            <span className="text-white/60 text-sm min-w-[40px]">{formatTime(duration)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="text-white/60 hover:text-white transition-colors"
                onClick={onDownload}
                disabled={downloadProgress !== null}
              >
                {downloadProgress !== null ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
              </button>
              <button className="text-white/60 hover:text-white transition-colors" onClick={onPrevious}>
                <SkipBack className="w-6 h-6" />
              </button>
              <button
                className="text-white hover:scale-105 transition-transform bg-purple-500/20 rounded-full p-2"
                onClick={onPlayPause}
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>
              <button className="text-white/60 hover:text-white transition-colors" onClick={onNext}>
                <SkipForward className="w-6 h-6" />
              </button>
              <button className="text-white/60 hover:text-white transition-colors">
                <Repeat className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-white/60" />
              <Slider
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={(values) => onVolumeChange(values[0])}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

