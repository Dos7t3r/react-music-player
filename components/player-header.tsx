interface PlayerHeaderProps {
  title: string
  artist: string
  textColor: string
  textColorFaded: string
}

export function PlayerHeader({ title, artist, textColor, textColorFaded }: PlayerHeaderProps) {
  return (
    <div className="text-center mb-4 lg:text-left lg:mb-8">
      <h1 className={`text-2xl lg:text-4xl font-bold tracking-tight ${textColor}`}>{title || "未在播放"}</h1>
      <p className={`mt-2 text-lg lg:text-xl ${textColorFaded}`}>{artist || "未在播放"}</p>
    </div>
  )
}

