<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header with Search -->
      <header class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold transition-all duration-500 ease-in-out transform hover:scale-110">Vue Music Player</h1>
        <div class="flex items-center gap-4">
          <div class="relative">
            <input 
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              type="search" 
              placeholder="搜索音乐..." 
              class="w-64 px-4 py-2 rounded-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
            <button 
              @click="handleSearch"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors duration-300 ease-in-out"
            >
              <SearchIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <!-- Player -->
      <div class="bg-gray-800 rounded-lg p-6 mb-8 transition-all duration-500 ease-in-out transform hover:scale-105">
        <div class="flex items-center justify-between mb-6">
          <div class="flex-1">
            <h2 class="text-xl font-semibold mb-2">{{ currentTrack.name || 'No track selected' }}</h2>
            <p class="text-gray-400">{{ currentTrack.artist || 'Unknown artist' }}</p>
          </div>
          <div class="w-24 h-24 bg-gray-700 rounded-lg overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-110">
            <img 
              :src="currentTrack.pic || '/placeholder.svg?height=96&width=96'" 
              :alt="currentTrack.name"
              class="w-full h-full object-cover"
            >
          </div>
        </div>

        <!-- Audio Player -->
        <audio
          ref="audioPlayer"
          :src="currentTrack.url"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onLoadedMetadata"
          @ended="onTrackEnded"
          @play="onPlay"
        ></audio>

        <!-- Progress Bar -->
        <div class="mb-4">
          <div 
            class="h-1 bg-gray-700 rounded-full cursor-pointer"
            @click="seek"
            ref="progressBar"
          >
            <div 
              class="h-full bg-white rounded-full"
              :style="{ width: `${progress}%` }"
            ></div>
          </div>
          <div class="flex justify-between text-sm mt-1">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-center gap-6">
          <button 
            @click="playPrevious"
            class="p-2 hover:text-white text-gray-400 transition-colors"
            :disabled="!hasPreviousTrack"
          >
            <SkipBackIcon class="w-6 h-6" />
          </button>
          <button 
            @click="togglePlay"
            class="p-4 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
          >
            <PlayIcon v-if="!isPlaying" class="w-6 h-6" />
            <PauseIcon v-else class="w-6 h-6" />
          </button>
          <button 
            @click="playNext"
            class="p-2 hover:text-white text-gray-400 transition-colors"
            :disabled="!hasNextTrack"
          >
            <SkipForwardIcon class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Lyrics -->
      <div v-if="lyrics.length" class="bg-gray-800 rounded-lg p-4 mt-6 transition-all duration-500 ease-in-out transform hover:scale-105">
        <h3 class="text-lg font-semibold mb-4">歌词</h3>
        <div 
          class="overflow-y-auto" 
          style="height: 120px; line-height: 30px;" 
          ref="lyricsContainer"
        >
          <p 
            v-for="(line, index) in currentLyrics" 
            :key="index" 
            :class="{ 
              'text-white': line.time <= currentTime, 
              'text-gray-400': line.time > currentTime,
              'font-bold': line.time <= currentTime && currentTime - line.time < 2  // Highlight current line
            }"
            class="text-sm text-center"
          >
            {{ line.text }}
          </p>
        </div>
      </div>

      <!-- Playlist -->
      <div class="bg-gray-800 rounded-lg p-6 mt-8">
        <h3 class="text-lg font-semibold mb-4">搜索结果</h3>
        <div v-if="isLoading" class="flex justify-center py-8">
          <LoaderIcon class="w-8 h-8 animate-spin text-gray-400" />
        </div>
        <div v-else-if="error" class="text-center py-8 text-red-400">
          {{ error }}
        </div>
        <div v-else-if="playlist.length === 0" class="text-center py-8 text-gray-400">
          搜索音乐开始播放
        </div>
        <div v-else class="space-y-2">
          <div 
            v-for="track in playlist" 
            :key="track.id"
            class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
            :class="{ 'bg-gray-700': currentTrack.id === track.id }"
            @click="playTrack(track)"
          >
            <img 
              :src="track.pic || '/placeholder.svg?height=48&width=48'" 
              :alt="track.name"
              class="w-12 h-12 rounded object-cover"
            >
            <div class="flex-1 min-w-0">
              <h4 class="font-medium truncate">{{ track.name }}</h4>
              <p class="text-sm text-gray-400 truncate">{{ track.artist }}</p>
            </div>
            <span class="text-sm text-gray-400">{{ track.duration || '未知时长' }}</span> <!-- Use track.duration directly here -->
          </div>
        </div>
      </div>
    </div>

    <!-- Top notification -->
    <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div v-show="showNotification" class="fixed bottom-4 right-4 bg-gray-700 text-white py-2 px-4 rounded-lg shadow-lg z-50">
        {{ notificationMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  PlayIcon, 
  PauseIcon, 
  SkipBackIcon, 
  SkipForwardIcon,
  SearchIcon,
  LoaderIcon
} from 'lucide-vue-next'

// State
const searchQuery = ref('')
const isLoading = ref(false)
const error = ref('')
const playlist = ref([])
const currentTrack = ref({})
const currentTrackIndex = ref(-1)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const lyrics = ref([])  // Store lyrics
const currentLyrics = ref([])  // Filtered lyrics to display
const audioPlayer = ref(null)
const progressBar = ref(null)

const showNotification = ref(false)
const notificationMessage = ref('欢迎使用')

// Computed
const progress = computed(() => (currentTime.value / duration.value) * 100 || 0)
const hasPreviousTrack = computed(() => currentTrackIndex.value > 0)
const hasNextTrack = computed(() => currentTrackIndex.value < playlist.value.length - 1)

// Methods
const handleSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  isLoading.value = true
  error.value = ''
  showNotification.value = true
  notificationMessage.value = '正在搜索...'
  
  try {
    const response = await fetch(`https://metingapi.nanorocky.top/?server=netease&type=search&id=0&yrc=true&keyword=${encodeURIComponent(searchQuery.value)}`)
    if (!response.ok) throw new Error('搜索失败')
    
    const data = await response.json()
    notificationMessage.value = '数据获取成功'
    
    if (data && Array.isArray(data)) {
      playlist.value = data.map(song => ({
        id: song.url.split('=')[1],  // Extract ID from URL
        name: song.name,
        artist: song.artist,
        album: song.album,
        pic: song.pic,
        url: song.url,
        lrc: song.lrc,  // Store the lrc URL
        duration: 0 // Initially set to 0, will be updated when the track is played
      }))
    } else {
      error.value = '未找到相关音乐'
      playlist.value = []
    }
  } catch (err) {
    error.value = err.message
    playlist.value = []
  } finally {
    isLoading.value = false
    setTimeout(() => {
      showNotification.value = false
    }, 3000)  // Hide the notification after 3 seconds
  }
}

const playTrack = async (track) => {
  if (audioPlayer.value) {
    audioPlayer.value.pause()
    audioPlayer.value.currentTime = 0
  }

  currentTrack.value = track
  currentTrackIndex.value = playlist.value.findIndex(t => t.id === track.id)

  // Show the current track being played
  showNotification.value = true
  notificationMessage.value = `正在播放：${track.name}`

  try {
    // Fetch lyrics
    if (track.lrc) {
      const lrcResponse = await fetch(track.lrc)
      if (lrcResponse.ok) {
        const lrcText = await lrcResponse.text()
        lyrics.value = parseLyrics(lrcText)
        currentLyrics.value = getLyricsForDisplay(lyrics.value)
      }
    }

    const response = await fetch(track.url)
    
    if (!response.ok) throw new Error('获取歌曲信息失败')

    const blob = await response.blob() // Handle .flac file as a blob
    const url = URL.createObjectURL(blob)

    currentTrack.value = { ...track, url: url, pic: track.pic, duration: audioPlayer.value.duration }
    
    if (audioPlayer.value) {
      audioPlayer.value.src = url
      audioPlayer.value.load()
      await audioPlayer.value.play()
      isPlaying.value = true
    }
  } catch (err) {
    error.value = err.message
  }
}

const togglePlay = () => {
  if (!currentTrack.value.url) return
  
  if (isPlaying.value) {
    audioPlayer.value.pause()
  } else {
    audioPlayer.value.play()
  }
  isPlaying.value = !isPlaying.value
}

const onTimeUpdate = () => {
  currentTime.value = audioPlayer.value.currentTime
  currentLyrics.value = getLyricsForDisplay(lyrics.value)
}

const onLoadedMetadata = () => {
  duration.value = audioPlayer.value.duration
}

const onTrackEnded = () => {
  isPlaying.value = false
  if (hasNextTrack.value) {
    playNext()
  }
}

const onPlay = () => {
  // Handle the play event
  isPlaying.value = true
}

const seek = (event) => {
  if (!audioPlayer.value) return
  
  const rect = progressBar.value.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  const time = percent * duration.value
  
  audioPlayer.value.currentTime = time
  currentTime.value = time
}

// Get lyrics for display (limit to 3 lines)
const getLyricsForDisplay = (lyrics) => {
  const visibleLyrics = lyrics.filter(line => 
    line.time <= currentTime.value && line.time > currentTime.value - 30
  )
  return visibleLyrics.slice(-3)  // Show only the last 3 lines
}

const formatTime = (seconds) => {
  if (!seconds) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// Parse lyrics (lrc format)
const parseLyrics = (lrcText) => {
  const lines = lrcText.split('\n')
  return lines.map(line => {
    const match = line.match(/\[(\d{2}):(\d{2}.\d{2})\](.*)/)
    if (match) {
      return {
        time: parseFloat(match[1]) * 60 + parseFloat(match[2]),
        text: match[3]
      }
    }
    return null
  }).filter(Boolean)
}

// Transition animations for the notification
const beforeEnter = (el) => {
  el.style.opacity = 0
}

const enter = (el, done) => {
  el.offsetHeight  // trigger reflow
  el.style.transition = 'opacity 1s ease-in-out'
  el.style.opacity = 1
  done()
}

const leave = (el, done) => {
  el.style.transition = 'opacity 1s ease-in-out'
  el.style.opacity = 0
  done()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease-in-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
