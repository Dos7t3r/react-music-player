import { useState } from "react"
import { Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Song } from "../types/music"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSongSelect: (song: Song) => void
}

export function SearchDialog({ open, onOpenChange, onSongSelect }: SearchDialogProps) {
  const [keyword, setKeyword] = useState("")
  const [results, setResults] = useState<Song[]>([])
  const [isSearching, setIsSearching] = useState(false)

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>搜索音乐</DialogTitle>
          <DialogDescription>输入歌曲名称或艺术家进行搜索</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 p-4">
          <Input
            placeholder="输入歌曲名称..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button size="icon" onClick={handleSearch} disabled={isSearching}>
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {isSearching ? (
            <div className="py-8 text-center text-muted-foreground">搜索中...</div>
          ) : results.length > 0 ? (
            <div className="space-y-2 pb-4">
              {results.map((song, index) => (
                <button
                  key={index}
                  className="w-full p-4 text-left hover:bg-accent rounded-lg transition-colors"
                  onClick={() => {
                    onSongSelect(song)
                    onOpenChange(false)
                  }}
                >
                  <div className="font-medium">{song.name}</div>
                  <div className="text-sm text-muted-foreground">{song.artist}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              {keyword ? "未找到相关歌曲" : "输入关键词开始搜索"}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

