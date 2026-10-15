"use client"

import { useState, useEffect } from "react"
import {
  Play,
  Heart,
  Plus,
  Search,
  Home,
  Library,
  User,
  Moon,
  Sun,
  PlusIcon,
  CheckCircle,
  Crown,
  Music,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import MusicPlayer from "@/components/music-player"
import MusicChatbot from "@/components/music-chatbot"
import { useTheme } from "@/components/theme-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const mockSongs = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    coverUrl: "/covers/blinding-lights.jpg",
    audioUrl: "/audio/blinding-lights.mp3",
    liked: true,
  },
  {
    id: "2",
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: "2:54",
    coverUrl: "/covers/watermelon-sugar.jpg",
    audioUrl: "/audio/watermelon-sugar.mp3",
    liked: false,
  },
  {
    id: "3",
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:24",
    coverUrl: "/covers/levitating.jpg",
    audioUrl: "/audio/levitating.mp3",
    liked: true,
  },
  {
    id: "4",
    title: "good 4 u",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    duration: "2:58",
    coverUrl: "/covers/good-4-u.jpg",
    audioUrl: "/audio/good-4-u.mp3",
    liked: false,
  },
  {
    id: "5",
    title: "STAY",
    artist: "The Kid LAROI & Justin Bieber",
    album: "F*CK LOVE 3: OVERKILL",
    duration: "2:21",
    coverUrl: "/covers/stay.jpg",
    audioUrl: "/audio/stay.mp3",
    liked: true,
  },
  {
    id: "6",
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    duration: "3:59",
    coverUrl: "/covers/heat-waves.jpg",
    audioUrl: "/audio/heat-waves.mp3",
    liked: false,
  },
  {
    id: "7",
    title: "Starboy",
    artist: "The Weeknd ft. Daft Punk",
    album: "Starboy",
    duration: "3:50",
    coverUrl: "/covers/starboy.jpg",
    audioUrl: "/audio/starboy.mp3",
    liked: true,
  },
  {
    id: "8",
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    duration: "2:47",
    coverUrl: "/covers/as-it-was.jpg",
    audioUrl: "/audio/as-it-was.mp3",
    liked: false,
  },
  {
    id: "9",
    title: "Cruel Summer",
    artist: "Taylor Swift",
    album: "Lover",
    duration: "2:58",
    coverUrl: "/covers/cruel-summer.jpg",
    audioUrl: "/audio/cruel-summer.mp3",
    liked: true,
  },
  {
    id: "10",
    title: "bad guy",
    artist: "Billie Eilish",
    album: "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?",
    duration: "3:14",
    coverUrl: "/covers/bad-guy.jpg",
    audioUrl: "/audio/bad-guy.mp3",
    liked: false,
  },
  {
    id: "11",
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "÷ (Divide)",
    duration: "3:54",
    coverUrl: "/covers/shape-of-you.jpg",
    audioUrl: "/audio/shape-of-you.mp3",
    liked: true,
  },
  {
    id: "12",
    title: "Don't Start Now",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:03",
    coverUrl: "/covers/dont-start-now.jpg",
    audioUrl: "/audio/dont-start-now.mp3",
    liked: false,
  },
]

const mockArtists = [
  {
    id: "1",
    name: "The Weeknd",
    genre: "R&B, Pop",
    followers: "85.2M",
    imageUrl: "/artists/the-weeknd.jpg",
    verified: true,
  },
  {
    id: "2",
    name: "Dua Lipa",
    genre: "Pop, Dance",
    followers: "73.1M",
    imageUrl: "/artists/dua-lipa.jpg",
    verified: true,
  },
  {
    id: "3",
    name: "Harry Styles",
    genre: "Pop, Rock",
    followers: "68.9M",
    imageUrl: "/artists/harry-styles.jpg",
    verified: true,
  },
  {
    id: "4",
    name: "Olivia Rodrigo",
    genre: "Pop, Alternative",
    followers: "45.3M",
    imageUrl: "/artists/olivia-rodrigo.jpg",
    verified: true,
  },
  {
    id: "5",
    name: "Taylor Swift",
    genre: "Pop, Country",
    followers: "92.4M",
    imageUrl: "/artists/taylor-swift.jpg",
    verified: true,
  },
  {
    id: "6",
    name: "Billie Eilish",
    genre: "Alternative, Pop",
    followers: "62.7M",
    imageUrl: "/artists/billie-eilish.jpg",
    verified: true,
  },
  {
    id: "7",
    name: "Ed Sheeran",
    genre: "Pop, Acoustic",
    followers: "78.5M",
    imageUrl: "/artists/ed-sheeran.jpg",
    verified: true,
  },
  {
    id: "8",
    name: "Glass Animals",
    genre: "Indie Rock",
    followers: "18.3M",
    imageUrl: "/artists/glass-animals.jpg",
    verified: true,
  },
]

const mockNewReleases = [
  {
    id: "1",
    title: "Midnights",
    artist: "Taylor Swift",
    releaseDate: "2022-10-21",
    coverUrl: "/albums/midnights.jpg",
    songs: [],
  },
  {
    id: "2",
    title: "Un Verano Sin Ti",
    artist: "Bad Bunny",
    releaseDate: "2022-05-06",
    coverUrl: "/albums/un-verano-sin-ti.jpg",
    songs: [],
  },
  {
    id: "3",
    title: "Renaissance",
    artist: "Beyoncé",
    releaseDate: "2022-07-29",
    coverUrl: "/albums/renaissance.jpg",
    songs: [],
  },
  {
    id: "4",
    title: "Harry's House",
    artist: "Harry Styles",
    releaseDate: "2022-05-20",
    coverUrl: "/albums/harrys-house.jpg",
    songs: [],
  },
]

const mockPopularPlaylists = [
  {
    id: "1",
    name: "Today's Top Hits",
    creator: "StreamFlow",
    description: "The biggest songs right now",
    coverUrl: "/playlists/top-hits.jpg",
    songs: mockSongs.slice(0, 4),
    followers: "32.1M",
  },
  {
    id: "2",
    name: "RapCaviar & Pop",
    creator: "StreamFlow",
    description: "New music and big tracks",
    coverUrl: "/playlists/rap-caviar.jpg",
    songs: mockSongs.slice(4, 8),
    followers: "15.8M",
  },
  {
    id: "3",
    name: "Pop Rising",
    creator: "StreamFlow",
    description: "Pop music on the rise",
    coverUrl: "/playlists/pop-rising.jpg",
    songs: mockSongs.slice(2, 6),
    followers: "8.9M",
  },
  {
    id: "4",
    name: "Chill Hits",
    creator: "StreamFlow",
    description: "Chill out to these laid back hits",
    coverUrl: "/playlists/chill-hits.jpg",
    songs: mockSongs.slice(6, 12),
    followers: "12.3M",
  },
]

const mockPodcasts = [
  {
    id: "1",
    title: "The Joe Rogan Experience",
    host: "Joe Rogan",
    description: "Conversations with interesting people",
    duration: "2h 45m",
    coverUrl: "/podcasts/joe-rogan.jpg",
    category: "Comedy",
    episodes: 2000,
  },
  {
    id: "2",
    title: "Crime Junkie",
    host: "Ashley Flowers",
    description: "True crime podcast",
    duration: "45m",
    coverUrl: "/podcasts/crime-junkie.jpg",
    category: "True Crime",
    episodes: 350,
  },
  {
    id: "3",
    title: "The Daily",
    host: "The New York Times",
    description: "This is what the news should sound like",
    duration: "25m",
    coverUrl: "/podcasts/the-daily.jpg",
    category: "News",
    episodes: 1500,
  },
  {
    id: "4",
    title: "Conan O'Brien Needs a Friend",
    host: "Conan O'Brien",
    description: "Comedy podcast with celebrity guests",
    duration: "1h 15m",
    coverUrl: "/podcasts/conan-obrien.jpg",
    category: "Comedy",
    episodes: 200,
  },
]

export default function HomePage() {
  const [songs, setSongs] = useState(mockSongs)
  const [playlists, setPlaylists] = useState([])
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("home")
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedSongs = localStorage.getItem("musicApp_songs")
    const savedPlaylists = localStorage.getItem("musicApp_playlists")

    if (savedSongs && savedSongs.includes(".mp3") && !savedSongs.includes("/placeholder")) {
      try {
        setSongs(JSON.parse(savedSongs))
      } catch (e) {
        setSongs(mockSongs)
      }
    } else {
      setSongs(mockSongs)
      localStorage.setItem("musicApp_songs", JSON.stringify(mockSongs))
    }

    if (savedPlaylists && !savedPlaylists.includes("/placeholder.svg")) {
      try {
        setPlaylists(JSON.parse(savedPlaylists))
      } catch (e) {
        setPlaylists(mockPopularPlaylists)
      }
    } else {
      setPlaylists(mockPopularPlaylists)
      localStorage.setItem("musicApp_playlists", JSON.stringify(mockPopularPlaylists))
    }

    // Sync from MongoDB API
    fetch("/api/songs")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.songs && data.songs.length > 0) {
          const mapped = data.songs.map((s, idx) => ({
            id: s._id || s.id || String(idx + 1),
            ...s,
          }))
          setSongs(mapped)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    localStorage.setItem("musicApp_songs", JSON.stringify(songs))
    localStorage.setItem("musicApp_playlists", JSON.stringify(playlists))
  }, [songs, playlists])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const toggleLike = (songId) => {
    setSongs(
      songs.map((song) =>
        (song.id === songId || song._id === songId) ? { ...song, liked: !song.liked } : song,
      ),
    )
  }

  const playSong = (song) => {
    setCurrentSong(song)
    setIsPlaying(true)
  }

  const createPlaylist = () => {
    if (newPlaylistName.trim()) {
      const newPlaylist = {
        id: Date.now().toString(),
        name: newPlaylistName,
        songs: [],
        coverUrl: "/playlists/top-hits.jpg",
      }
      setPlaylists([...playlists, newPlaylist])
      setNewPlaylistName("")
      setShowCreatePlaylist(false)
    }
  }

  const addToPlaylist = (song, playlistId) => {
    setPlaylists(
      playlists.map((playlist) =>
        playlist.id === playlistId ? { ...playlist, songs: [...playlist.songs, song] } : playlist,
      ),
    )
  }

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const likedSongs = songs.filter((song) => song.liked)

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              StreamFlow
            </h1>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search songs, artists, albums..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" asChild>
              {user ? (
                <Link href="/profile">
                  <User className="h-5 w-5" />
                </Link>
              ) : (
                <Link href="/auth">
                  <User className="h-5 w-5" />
                </Link>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/30 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "home" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("home")}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button
              variant={activeTab === "library" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("library")}
            >
              <Library className="mr-2 h-4 w-4" />
              Your Library
            </Button>
            <Button
              variant={activeTab === "liked" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("liked")}
            >
              <Heart className="mr-2 h-4 w-4" />
              Liked Songs
            </Button>
            <Button
              variant={activeTab === "podcasts" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("podcasts")}
            >
              <Search className="mr-2 h-4 w-4" />
              Podcasts
            </Button>
            <Button
              variant={activeTab === "premium" ? "secondary" : "ghost"}
              className="w-full justify-start bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-blue-700 hover:to-green-700"
              onClick={() => setActiveTab("premium")}
            >
              <Crown className="mr-2 h-4 w-4" />
              Premium
            </Button>
          </nav>

          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Playlists</h3>
              <Button size="sm" variant="ghost" onClick={() => setShowCreatePlaylist(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {showCreatePlaylist && (
              <div className="space-y-2 mb-4">
                <Input
                  placeholder="Playlist name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && createPlaylist()}
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={createPlaylist}>
                    Create
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowCreatePlaylist(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {playlists.map((playlist) => (
                <Button
                  key={playlist.id}
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => setActiveTab(`playlist-${playlist.id}`)}
                >
                  {playlist.name}
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 pb-32">
          {activeTab === "home" && (
            <div className="space-y-12">
              {/* Popular Playlists */}
              <section>
                <h2 className="text-3xl font-bold mb-6">Popular Playlists</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {mockPopularPlaylists.map((playlist) => (
                    <Card key={playlist.id} className="group hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="relative mb-4">
                          <img
                            src={playlist.coverUrl || "/placeholder.svg"}
                            alt={playlist.name}
                            className="w-full aspect-square object-cover rounded-md"
                          />
                          <Button
                            size="icon"
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-green-600 hover:bg-green-700"
                            onClick={() => playlist.songs.length > 0 && playSong(playlist.songs[0])}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                        <h3 className="font-semibold truncate">{playlist.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">by {playlist.creator}</p>
                        <p className="text-xs text-muted-foreground mt-1">{playlist.followers} followers</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Popular Artists */}
              <section>
                <h2 className="text-3xl font-bold mb-6">Popular Artists</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {mockArtists.map((artist) => (
                    <Card key={artist.id} className="group hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4 text-center">
                        <div className="relative mb-4">
                          <img
                            src={artist.imageUrl || "/placeholder.svg"}
                            alt={artist.name}
                            className="w-full aspect-square object-cover rounded-full mx-auto"
                          />
                          {artist.verified && (
                            <CheckCircle className="absolute bottom-2 right-2 h-6 w-6 text-blue-500 bg-white rounded-full" />
                          )}
                        </div>
                        <h3 className="font-semibold truncate">{artist.name}</h3>
                        <p className="text-sm text-muted-foreground">{artist.genre}</p>
                        <p className="text-xs text-muted-foreground mt-1">{artist.followers} followers</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* New Releases */}
              <section>
                <h2 className="text-3xl font-bold mb-6">New Releases</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {mockNewReleases.map((album) => (
                    <Card key={album.id} className="group hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="relative mb-4">
                          <img
                            src={album.coverUrl || "/placeholder.svg"}
                            alt={album.title}
                            className="w-full aspect-square object-cover rounded-md"
                          />
                          <Button
                            size="icon"
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-green-600 hover:bg-green-700"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                        <h3 className="font-semibold truncate">{album.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{album.artist}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(album.releaseDate).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Featured Music */}
              <section>
                <h2 className="text-3xl font-bold mb-6">Featured Music</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {(searchQuery ? filteredSongs : songs).map((song) => (
                    <Card key={song.id} className="group hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="relative mb-4">
                          <img
                            src={song.coverUrl || "/placeholder.svg"}
                            alt={song.album}
                            className="w-full aspect-square object-cover rounded-md"
                          />
                          <Button
                            size="icon"
                            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-green-600 hover:bg-green-700"
                            onClick={() => playSong(song)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                        <h3 className="font-semibold truncate">{song.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">{song.duration}</span>
                          <div className="flex items-center space-x-1">
                            <Button size="sm" variant="ghost" onClick={() => toggleLike(song.id)}>
                              <Heart className={`h-4 w-4 ${song.liked ? "fill-red-500 text-red-500" : ""}`} />
                            </Button>
                            {playlists.length > 0 && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="ghost">
                                    <PlusIcon className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  {playlists.map((playlist) => (
                                    <DropdownMenuItem
                                      key={playlist.id}
                                      onClick={() => addToPlaylist(song, playlist.id)}
                                    >
                                      Add to {playlist.name}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === "liked" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Liked Songs</h2>
              <div className="space-y-2">
                {likedSongs.map((song, index) => (
                  <div key={song.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 group">
                    <span className="w-8 text-sm text-muted-foreground">{index + 1}</span>
                    <img src={song.coverUrl || "/placeholder.svg"} alt={song.album} className="w-12 h-12 rounded" />
                    <div className="flex-1">
                      <h4 className="font-medium">{song.title}</h4>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{song.duration}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100"
                      onClick={() => playSong(song)}
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleLike(song.id)}>
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "library" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Your Library</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {playlists.map((playlist) => (
                  <Card key={playlist.id} className="group hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <img
                        src={playlist.coverUrl || "/placeholder.svg"}
                        alt={playlist.name}
                        className="w-full aspect-square object-cover rounded-md mb-4"
                      />
                      <h3 className="font-semibold truncate">{playlist.name}</h3>
                      <p className="text-sm text-muted-foreground">{playlist.songs.length} songs</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab.startsWith("playlist-") && (
            <div className="space-y-6">
              {(() => {
                const playlistId = activeTab.replace("playlist-", "")
                const playlist = playlists.find((p) => p.id === playlistId)
                if (!playlist) return null

                return (
                  <>
                    <div className="flex items-center space-x-4">
                      <img
                        src={playlist.coverUrl || "/placeholder.svg"}
                        alt={playlist.name}
                        className="w-48 h-48 rounded-lg object-cover"
                      />
                      <div>
                        <h2 className="text-4xl font-bold mb-2">{playlist.name}</h2>
                        <p className="text-muted-foreground">{playlist.songs.length} songs</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {playlist.songs.map((song, index) => (
                        <div
                          key={`${song.id}-${index}`}
                          className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 group"
                        >
                          <span className="w-8 text-sm text-muted-foreground">{index + 1}</span>
                          <img
                            src={song.coverUrl || "/placeholder.svg"}
                            alt={song.album}
                            className="w-12 h-12 rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{song.title}</h4>
                            <p className="text-sm text-muted-foreground">{song.artist}</p>
                          </div>
                          <span className="text-sm text-muted-foreground">{song.duration}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100"
                            onClick={() => playSong(song)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </>
                )
              })()}
            </div>
          )}
          {activeTab === "podcasts" && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Podcasts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockPodcasts.map((podcast) => (
                  <Card key={podcast.id} className="group hover:bg-muted/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="relative mb-4">
                        <img
                          src={podcast.coverUrl || "/placeholder.svg"}
                          alt={podcast.title}
                          className="w-full aspect-square object-cover rounded-md"
                        />
                        <Button
                          size="icon"
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-green-600 hover:bg-green-700"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {podcast.category}
                      </Badge>
                      <h3 className="font-semibold truncate">{podcast.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{podcast.host}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{podcast.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{podcast.duration}</span>
                        <span className="text-xs text-muted-foreground">{podcast.episodes} episodes</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "premium" && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Upgrade to Premium
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Unlock the full potential of StreamFlow with our premium plans
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="relative backdrop-blur-sm border-2 hover:border-blue-500 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center">
                        <Music className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">Free</h3>
                      <div className="text-3xl font-bold">
                        $0<span className="text-sm font-normal text-muted-foreground">/forever</span>
                      </div>
                      <p className="text-muted-foreground">Perfect for casual listeners</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Limited skips per hour</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Ads between songs</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Standard audio quality</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Basic playlist creation</span>
                      </li>
                    </ul>

                    <Button className="w-full bg-transparent" variant="outline">
                      Current Plan
                    </Button>
                  </CardContent>
                </Card>

                <Card className="relative backdrop-blur-sm border-2 border-green-500 scale-105 shadow-lg">
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white">
                    Most Popular
                  </Badge>
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                        <Crown className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">Premium</h3>
                      <div className="text-3xl font-bold">
                        $9.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                      </div>
                      <p className="text-muted-foreground">The complete music experience</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Unlimited skips</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">No ads</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">High-quality audio</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Offline downloads</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Unlimited playlists</span>
                      </li>
                    </ul>

                    <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                      <Link href="/membership">Get Premium</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="relative backdrop-blur-sm border-2 hover:border-purple-500 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <Crown className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">Family</h3>
                      <div className="text-3xl font-bold">
                        $14.99<span className="text-sm font-normal text-muted-foreground">/month</span>
                      </div>
                      <p className="text-muted-foreground">Perfect for families</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">All Premium features</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">6 individual accounts</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Family mix playlist</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Parental controls</span>
                      </li>
                    </ul>

                    <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                      <Link href="/membership">Get Family</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <p className="text-muted-foreground text-sm">
                  All plans include a 30-day money-back guarantee. Cancel anytime.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Music Player */}
      {currentSong && (
        <MusicPlayer
          song={currentSong}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onNext={() => {
            const currentIdentifier = currentSong.id || currentSong._id
            const currentIndex = songs.findIndex((s) => (s.id || s._id) === currentIdentifier)
            const nextSong = songs[(currentIndex + 1) % songs.length]
            setCurrentSong(nextSong)
            setIsPlaying(true)
          }}
          onPrevious={() => {
            const currentIdentifier = currentSong.id || currentSong._id
            const currentIndex = songs.findIndex((s) => (s.id || s._id) === currentIdentifier)
            const prevSong = songs[(currentIndex - 1 + songs.length) % songs.length]
            setCurrentSong(prevSong)
            setIsPlaying(true)
          }}
          onLike={() => toggleLike(currentSong.id || currentSong._id)}
        />
      )}

      {/* AI Music Concierge Chatbot */}
      <MusicChatbot songs={songs} onPlaySong={playSong} currentSong={currentSong} />
    </div>
  )
}
