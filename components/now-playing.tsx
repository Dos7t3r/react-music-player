import type { Song } from "../types/music"

interface NowPlayingProps {
  currentSong: Song | null
  isLoading: boolean
}

export function NowPlaying({ currentSong, isLoading }: NowPlayingProps) {
  if (isLoading) {
    return (
      <div className="bg-black/20 backdrop-blur-md rounded-lg p-4 w-full max-w-md">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg bg-white/10 animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-white/10 rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentSong) {
    return (
      <div className="bg-black/20 backdrop-blur-md rounded-lg p-4 w-full max-w-md">
        <div className="text-center text-white/60">No song playing</div>
      </div>
    )
  }

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-lg p-4 w-full max-w-md">
      <div className="flex items-center space-x-4">
        <img
          src={currentSong.pic || "/placeholder.svg"}
          alt={currentSong.name}
          className="w-16 h-16 md:w-24 md:h-24 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg md:text-xl font-bold text-white truncate">{currentSong.name}</h2>
          <p className="text-white/60 truncate">{currentSong.artist}</p>
        </div>
      </div>
    </div>
  )
}

