import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let timer: NodeJS.Timeout
    let lastProgress = 0

    const simulateProgress = () => {
      const remainingProgress = 100 - lastProgress
      const increment = Math.random() * (remainingProgress * 0.1) + 0.1
      const newProgress = Math.min(lastProgress + increment, 100)

      setProgress(newProgress)
      lastProgress = newProgress

      if (lastProgress < 100) {
        const delay = Math.random() * 200 + 50 // 50-250ms
        timer = setTimeout(simulateProgress, delay)
      }
    }

    simulateProgress()

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center">
      <div className="text-4xl font-bold text-gray-300 mb-8 animate-pulse">Music Player</div>
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-gray-400 mt-4">Loading... {Math.round(progress)}%</div>
      <div className="absolute bottom-4 left-4 text-gray-600 text-sm">By Dos7t3r</div>
    </div>
  )
}

