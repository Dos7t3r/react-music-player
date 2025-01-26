export async function extractColors(imageUrl: string): Promise<[string, string]> {
  // Default colors - warm amber to forest green gradient
  const defaultColors: [string, string] = ["rgb(193, 116, 67)", "rgb(34, 97, 67)"]

  if (!imageUrl) return defaultColors

  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onerror = () => {
      resolve(defaultColors)
    }

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          resolve(defaultColors)
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        let r = 0,
          g = 0,
          b = 0
        let count = 0

        // Sample every 4th pixel for performance
        for (let i = 0; i < imageData.length; i += 16) {
          r += imageData[i]
          g += imageData[i + 1]
          b += imageData[i + 2]
          count++
        }

        r = Math.round(r / count)
        g = Math.round(g / count)
        b = Math.round(b / count)

        // Ensure minimum brightness
        const minBrightness = 30
        r = Math.max(r, minBrightness)
        g = Math.max(g, minBrightness)
        b = Math.max(b, minBrightness)

        const color1 = `rgb(${r}, ${g}, ${b})`
        const color2 = `rgb(${Math.max(Math.round(r * 0.2), minBrightness)}, ${Math.max(Math.round(g * 0.8), minBrightness)}, ${Math.max(Math.round(b * 0.6), minBrightness)})`

        resolve([color1, color2])
      } catch (error) {
        console.error("Color extraction failed:", error)
        resolve(defaultColors)
      }
    }

    img.src = imageUrl
  })
}

