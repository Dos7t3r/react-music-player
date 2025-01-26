export function getColorInfo(imageUrl: string): Promise<{ primary: string; secondary: string; isLight: boolean }> {
  console.log("Getting color info for:", imageUrl)
  return new Promise((resolve) => {
    const defaultColors = (() => {
      // 预定义一些好看的渐变色组合
      const gradients = [
        { primary: "#4338ca", secondary: "#312e81" }, // Indigo
        { primary: "#0ea5e9", secondary: "#0369a1" }, // Sky
        { primary: "#8b5cf6", secondary: "#6d28d9" }, // Violet
        { primary: "#ec4899", secondary: "#be185d" }, // Pink
        { primary: "#10b981", secondary: "#047857" }, // Emerald
      ]

      // 随机选择一个渐变色组合
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)]

      return {
        ...randomGradient,
        isLight: false,
      }
    })()

    if (!imageUrl) {
      resolve(defaultColors)
      return
    }

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onerror = () => {
      const newDefault = (() => {
        const gradients = [
          { primary: "#4338ca", secondary: "#312e81" },
          { primary: "#0ea5e9", secondary: "#0369a1" },
          { primary: "#8b5cf6", secondary: "#6d28d9" },
          { primary: "#ec4899", secondary: "#be185d" },
          { primary: "#10b981", secondary: "#047857" },
        ]
        const randomGradient = gradients[Math.floor(Math.random() * gradients.length)]
        return {
          ...randomGradient,
          isLight: false,
        }
      })()
      resolve(newDefault)
    }

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        if (!ctx) {
          resolve(defaultColors)
          return
        }

        // 缩小图片以提高性能
        const size = 64
        canvas.width = size
        canvas.height = size
        ctx.drawImage(img, 0, 0, size, size)

        const imageData = ctx.getImageData(0, 0, size, size).data
        const colorCounts: { [key: string]: number } = {}
        const colors: number[][] = []

        // 收集所有非黑色像素并计算颜色出现频率
        for (let i = 0; i < imageData.length; i += 4) {
          const r = imageData[i]
          const g = imageData[i + 1]
          const b = imageData[i + 2]

          if (r + g + b > 0) {
            // 量化颜色以减少变体
            const quantizedColor = [Math.round(r / 32) * 32, Math.round(g / 32) * 32, Math.round(b / 32) * 32]
            const colorKey = quantizedColor.join(",")
            colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1
            colors.push([r, g, b])
          }
        }

        if (colors.length === 0) {
          resolve(defaultColors)
          return
        }

        // 找出出现最多的颜色
        const dominantColorKey = Object.entries(colorCounts).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
        const dominantColor = dominantColorKey.split(",").map(Number)

        // 计算亮度
        const brightness = (dominantColor[0] * 299 + dominantColor[1] * 587 + dominantColor[2] * 114) / 1000
        const isLight = brightness > 128

        // 生成渐变色
        // 如果颜色太亮或太暗，进行调整
        const adjustedColor = dominantColor.map((c) => Math.min(Math.max(c, 30), 225))

        const primary = `rgb(${adjustedColor[0]}, ${adjustedColor[1]}, ${adjustedColor[2]})`
        const secondary = `rgb(${Math.round(adjustedColor[0] * 0.7)}, ${Math.round(
          adjustedColor[1] * 0.7,
        )}, ${Math.round(adjustedColor[2] * 0.7)})`

        console.log("Extracted colors:", { primary, secondary, isLight })
        resolve({
          primary,
          secondary,
          isLight,
        })
      } catch (error) {
        console.error("Color extraction failed:", error)
        resolve(defaultColors)
      }
    }

    img.src = imageUrl
  })
}

