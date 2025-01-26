export interface Song {
  id: number
  name: string
  artist: string
  album: string
  url: string
  pic: string
  lrc: string
  source: string
}

export interface LyricLine {
  time: number
  text: string
}

export interface PlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
}

