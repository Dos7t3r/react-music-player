export function getAudioType(url: string): string {
  const extension = url.split(".").pop()?.toLowerCase()
  switch (extension) {
    case "flac":
      return "audio/flac"
    case "mp3":
      return "audio/mpeg"
    case "m4a":
      return "audio/mp4"
    case "wav":
      return "audio/wav"
    default:
      return "audio/mpeg" // Default to mp3
  }
}

export function canPlayType(audio: HTMLAudioElement, type: string): boolean {
  const support = audio.canPlayType(type)
  return support !== "" && support !== "no"
}

