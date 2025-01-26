"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Song } from "../types/music"

interface PlaylistProps {
  currentSong: Song | null
  onSongSelect: (song: Song) => void
}

export function Playlist({ currentSong, onSongSelect }: PlaylistProps) {
  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState<Song[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(true)
  //const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)

  function handleSongSelect(song: Song) {
    onSongSelect(song)
    setIsSearchVisible(false)
  }

  async function handleSearch() {
    if (!keyword.trim() || isSearching) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://metingapi.nanorocky.top/?server=netease&type=search&id=0&yrc=true&keyword=${encodeURIComponent(
          keyword,
        )}`,
      )
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const SearchContent = () => (
    <>
      {isSearchVisible && (
        <>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="搜索音乐..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-white/10 border-0 text-white placeholder:text-white/60"
            />
            <Button onClick={handleSearch} disabled={isSearching} variant="secondary">
              <Search className="w-5 h-5" />
            </Button>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {isSearching ? (
              <div className="py-8 text-center text-white/60">搜索中...</div>
            ) : results.length > 0 ? (
              results.map((song) => (
                <button
                  key={song.id}
                  onClick={() => handleSongSelect(song)}
                  className={cn(
                    "w-full flex items-start gap-4 p-2 rounded-lg transition-all",
                    "hover:bg-white/10",
                    currentSong?.id === song.id && "bg-white/5",
                  )}
                >
                  <img
                    src={song.pic || "/placeholder.svg"}
                    alt={song.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-1 text-left">
                    <h3 className="text-white font-medium line-clamp-1">{song.name}</h3>
                    <p className="text-white/60 text-sm line-clamp-1">{song.artist}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="py-8 text-center text-white/60">{keyword ? "未找到相关歌曲" : "输入关键词开始搜索"}</div>
            )}
          </div>
        </>
      )}
      {!isSearchVisible && (
        <Button onClick={() => setIsSearchVisible(true)} className="w-full" variant="secondary">
          <Search className="w-5 h-5 mr-2" />
          搜索音乐
        </Button>
      )}
    </>
  )

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-lg p-4 w-full max-w-md">
      <div className="md:hidden">
        {isSearchVisible ? (
          <SearchContent />
        ) : (
          <Button onClick={() => setIsSearchVisible(true)} className="w-full" variant="secondary">
            <Search className="w-5 h-5 mr-2" />
            搜索音乐
          </Button>
        )}
      </div>
      <div className="hidden md:block">
        <SearchContent />
      </div>
    </div>
  )
}

