interface PlayerCoverProps {
  imageUrl: string
}

export function PlayerCover({ imageUrl }: PlayerCoverProps) {
  return (
    <div className="mb-8 flex justify-center lg:mb-0">
      <img
        src={
          imageUrl || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-a909InJhDtV4RjMB1pxT5pzSlOQrpc.png"
        }
        alt="Album cover"
        className="w-48 h-48 lg:w-80 lg:h-80 rounded-lg object-cover shadow-lg transition-all duration-300"
      />
    </div>
  )
}

