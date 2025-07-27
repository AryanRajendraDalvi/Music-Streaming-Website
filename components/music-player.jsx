"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Heart, Volume2, VolumeX, Repeat, Shuffle } from "lucide-react"

export default function MusicPlayer({ song, isPlaying, onPlayPause, onNext, onPrevious, onLike }) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(70)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play()
    } else {
      audio.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = isMuted ? 0 : volume / 100
  }, [volume, isMuted])

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleSeek = (value) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (value[0] / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
      <audio ref={audioRef} src={song.audioUrl} />

      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* Song Info */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <img src={song.coverUrl || "/placeholder.svg"} alt={song.album} className="w-14 h-14 rounded-md" />
          <div className="min-w-0">
            <h4 className="font-medium truncate">{song.title}</h4>
            <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
          </div>
          <Button size="sm" variant="ghost" onClick={onLike}>
            <Heart className={`h-4 w-4 ${song.liked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
          <div className="flex items-center space-x-4">
            <Button size="sm" variant="ghost" onClick={() => setIsShuffle(!isShuffle)}>
              <Shuffle className={`h-4 w-4 ${isShuffle ? "text-green-500" : ""}`} />
            </Button>
            <Button size="sm" variant="ghost" onClick={onPrevious}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white rounded-full w-10 h-10"
              onClick={onPlayPause}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="ghost" onClick={onNext}>
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsRepeat(!isRepeat)}>
              <Repeat className={`h-4 w-4 ${isRepeat ? "text-green-500" : ""}`} />
            </Button>
          </div>

          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-muted-foreground w-10">{formatTime(currentTime)}</span>
            <Slider
              value={[duration ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              className="flex-1"
              max={100}
              step={1}
            />
            <span className="text-xs text-muted-foreground w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 flex-1 justify-end">
          <Button size="sm" variant="ghost" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider value={[volume]} onValueChange={(value) => setVolume(value[0])} className="w-24" max={100} step={1} />
        </div>
      </div>
    </div>
  )
}
