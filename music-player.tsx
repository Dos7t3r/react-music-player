"use client"

import { useEffect, useRef, useState } from "react"
import { NowPlaying } from "./components/now-playing"
import { Lyrics } from "./components/lyrics"
import { PlayerControls } from "./components/player-controls"
import { Header } from "./components/header"
import { LoadingScreen } from "./components/loading-screen"
import { parseLyric } from "./utils/lyric"
import { getAudioType, canPlayType } from "./utils/audio"
import type { Song, LyricLine, PlayerState } from "./types/music"
import toast from "react-hot-toast"

export default function MusicPlayer() {
  const [isLoading, setIsLoading] = useState(true)
  const [playlist, setPlaylist] = useState<Song[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [lyrics, setLyrics] = useState<LyricLine[]>([])
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(-1)
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false)
  const [isLoadingSong, setIsLoadingSong] = useState(false)
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
  })
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null)
  const [isChangingSong, setIsChangingSong] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const currentSong = playlist[currentIndex]

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Handle song changes
  useEffect(() => {
    if (!currentSong) return

    const loadSong = async () => {
      setIsLoadingLyrics(true)
      setIsLoadingSong(true)
      setIsChangingSong(true)

      try {
        // Check audio format support
        if (audioRef.current) {
          const audioType = getAudioType(currentSong.url)
          if (!canPlayType(audioRef.current, audioType)) {
            throw new Error(`不支持的音频格式: ${audioType}`)
          }

          // Reset audio element
          audioRef.current.removeAttribute("src")
          audioRef.current.load()

          // Set new source with proper type
          audioRef.current.src = currentSong.url
          await audioRef.current.load()
        }

        // Load lyrics
        const lrcResponse = await fetch(currentSong.lrc)
        const lrcText = await lrcResponse.text()
        const parsedLyrics = parseLyric(lrcText)
        setLyrics(parsedLyrics)

        // Reset states
        setPlayerState((prev) => ({
          ...prev,
          currentTime: 0,
          isPlaying: true,
        }))

        // Attempt to play
        if (audioRef.current) {
          try {
            await audioRef.current.play()
          } catch (error: any) {
            console.error("Playback failed:", error)
            setPlayerState((prev) => ({ ...prev, isPlaying: false }))

            // Provide more specific error messages
            if (error.name === "NotSupportedError") {
              showNotification("当前浏览器不支持该音频格式")
            } else if (error.name === "NotAllowedError") {
              showNotification("需要用户交互才能播放")
            } else {
              showNotification("播放失败，请重试")
            }
          }
        }
      } catch (error: any) {
        console.error("Failed to load song:", error)
        showNotification(error.message || "加载失败，请重试")
        // Reset states on error
        setLyrics([])
        if (audioRef.current) {
          audioRef.current.removeAttribute("src")
          audioRef.current.load()
        }
      } finally {
        setIsLoadingLyrics(false)
        setIsLoadingSong(false)
        setIsChangingSong(false)
      }
    }

    loadSong()

    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeAttribute("src")
        audioRef.current.load()
      }
    }
  }, [currentSong])

  // Handle play/pause state changes
  useEffect(() => {
    if (!audioRef.current || isChangingSong) return

    if (playerState.isPlaying) {
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Playback failed:", error)
          setPlayerState((prev) => ({ ...prev, isPlaying: false }))
        })
      }
    } else {
      audioRef.current.pause()
    }
  }, [playerState.isPlaying, isChangingSong])

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playerState.volume
    }
  }, [playerState.volume])

  function handleTimeUpdate() {
    if (!audioRef.current) return
    const time = audioRef.current.currentTime
    setPlayerState((prev) => ({ ...prev, currentTime: time }))

    if (!lyrics.length) return
    const timeMs = time * 1000
    const index = lyrics.findIndex((line) => line.time > timeMs)

    if (index === -1) {
      setCurrentLyricIndex(lyrics.length - 1)
    } else if (index === 0) {
      setCurrentLyricIndex(-1)
    } else {
      setCurrentLyricIndex(index - 1)
    }
  }

  function handleLoadedMetadata() {
    if (!audioRef.current) return
    setPlayerState((prev) => ({
      ...prev,
      duration: audioRef.current.duration,
    }))
    setIsLoadingSong(false)
  }

  function handleSongSelect(song: Song) {
    setIsLoadingSong(true)
    const index = playlist.findIndex((s) => s.url === song.url)
    if (index === -1) {
      setPlaylist([...playlist, song])
      setCurrentIndex(playlist.length)
    } else {
      setCurrentIndex(index)
    }
  }

  function handleSeek(newTime: number) {
    if (!audioRef.current) return
    audioRef.current.currentTime = newTime
    setPlayerState((prev) => ({ ...prev, currentTime: newTime }))
  }

  function handleVolumeChange(newVolume: number) {
    setPlayerState((prev) => ({ ...prev, volume: newVolume }))
  }

  async function handleDownload() {
    if (!currentSong) return

    try {
      showNotification("开始下载")
      const response = await fetch(currentSong.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      const sanitizedName =
        `${currentSong.name.replace(/[^\w\s-]/gi, "")}_${currentSong.artist.replace(/[^\w\s-]/gi, "")}`
          .trim()
          .replace(/\s+/g, "_")
      a.download = `${sanitizedName}.mp3`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      showNotification("下载完成")
    } catch (error) {
      console.error("Download failed:", error)
      showNotification("下载失败，请重试")
    }
  }

  function showNotification(message: string) {
    toast(message, {
      duration: 3000,
      style: {
        background: "#333",
        color: "#fff",
      },
    })
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center transition-all duration-300"
      style={{
        backgroundImage: currentSong?.pic ? `url(${currentSong.pic})` : "none",
        backgroundColor: "rgb(17, 24, 39)",
      }}
    >
      <div className="min-h-screen backdrop-blur-xl bg-black/60">
        <Header onSongSelect={handleSongSelect} showNotification={showNotification} />

        {/* Desktop Layout */}
        <div className="hidden lg:block max-w-7xl mx-auto p-8 pb-32 pt-24">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-5">
              <div className="border border-orange-500/20 rounded-lg p-6 backdrop-blur-md bg-black/20">
                <h3 className="text-orange-500/60 mb-4 text-lg">歌曲封面</h3>
                <img
                  src={currentSong?.pic || "/placeholder.svg"}
                  alt={currentSong?.name || "Album cover"}
                  className="w-full aspect-square rounded-lg object-cover"
                />
              </div>
            </div>

            <div className="col-span-7 space-y-6">
              <div className="border border-orange-500/20 rounded-lg p-6 backdrop-blur-md bg-black/20">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white">{currentSong?.name || "未在播放"}</h2>
                  <p className="text-xl text-white/60">{currentSong?.artist || "未在播放"}</p>
                </div>
              </div>

              <div className="border border-orange-500/20 rounded-lg p-6 backdrop-blur-md bg-black/20 h-[500px]">
                <h3 className="text-orange-500/60 mb-4 text-lg">歌词</h3>
                <Lyrics
                  lyrics={lyrics}
                  currentLyricIndex={currentLyricIndex}
                  isLoading={isLoadingLyrics}
                  className="h-[calc(500px-4rem)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden max-w-7xl mx-auto p-4 pb-32 pt-20">
          <div className="space-y-8">
            <div className="lg:flex-1 lg:max-w-md">
              <NowPlaying currentSong={currentSong} isLoading={isLoadingSong} />
            </div>
            <div className="lg:flex-1 lg:max-w-2xl">
              <Lyrics lyrics={lyrics} currentLyricIndex={currentLyricIndex} isLoading={isLoadingLyrics} />
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <PlayerControls
          isPlaying={playerState.isPlaying}
          onPlayPause={() => setPlayerState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))}
          onPrevious={() => {
            if (currentIndex > 0) {
              setCurrentIndex((prev) => prev - 1)
            }
          }}
          onNext={() => {
            if (currentIndex < playlist.length - 1) {
              setCurrentIndex((prev) => prev + 1)
            }
          }}
          canPrevious={currentIndex > 0}
          canNext={currentIndex < playlist.length - 1}
          currentTime={playerState.currentTime}
          duration={playerState.duration}
          volume={playerState.volume}
          onVolumeChange={handleVolumeChange}
          onSeek={handleSeek}
          onDownload={handleDownload}
          downloadProgress={downloadProgress}
          showNotification={showNotification}
          isLoading={isLoadingSong}
        />

        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            if (currentIndex < playlist.length - 1) {
              setCurrentIndex((prev) => prev + 1)
            } else {
              setPlayerState((prev) => ({ ...prev, isPlaying: false }))
            }
          }}
          onError={(e) => {
            const error = e.currentTarget.error
            setIsLoadingSong(false)
            setPlayerState((prev) => ({ ...prev, isPlaying: false }))

            // Provide specific error messages based on the error code
            switch (error?.code) {
              case MediaError.MEDIA_ERR_ABORTED:
                showNotification("播放被中断")
                break
              case MediaError.MEDIA_ERR_NETWORK:
                showNotification("网络错误，请检查网络连接")
                break
              case MediaError.MEDIA_ERR_DECODE:
                showNotification("音频解码错误，可能是格式不支持")
                break
              case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                showNotification("不支持的音频格式或来源")
                break
              default:
                showNotification("播放出错，请重试")
            }
          }}
        />
      </div>
    </div>
  )
}

