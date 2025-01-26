"use client"

import { useState, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Toaster } from "react-hot-toast"
import type { Song } from "../types/music"

interface HeaderProps {
  onSongSelect: (song: Song) => void
  showNotification: (message: string) => void
}

export function Header({ onSongSelect, showNotification }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState<Song[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchOpen])

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
      showNotification("数据获取成功")
    } catch (error) {
      console.error("Search failed:", error)
      showNotification("搜索失败，请重试")
    } finally {
      setIsSearching(false)
    }
  }

  function handleSongSelect(song: Song) {
    onSongSelect(song)
    setIsSearchOpen(false)
    setKeyword("")
    setResults([])
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-lg p-4 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          ⚛ REACT ⚛
        </h1>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className={cn("transition-all duration-300 text-white/80 hover:text-white", isSearchOpen && "scale-125")}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>
          {isSearchOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-black/80 backdrop-blur-md rounded-lg p-4 transition-all duration-300">
              <div className="flex gap-2 mb-4">
                <Input
                  ref={inputRef}
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
                      className="w-full flex items-start gap-4 p-2 rounded-lg transition-all hover:bg-white/10"
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
                  <div className="py-8 text-center text-white/60">
                    {keyword ? "未找到相关歌曲" : "输入关键词开始搜索"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-right" />
    </header>
  )
}

