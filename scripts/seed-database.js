// This script seeds the database with initial real data
const { MongoClient } = require("mongodb")
const fs = require("fs")
const path = require("path")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const dbName = "streamflow"

let mediaData = { songs: [], artists: [] }
try {
  const mediaPath = path.join(__dirname, "processed_media.json")
  if (fs.existsSync(mediaPath)) {
    mediaData = JSON.parse(fs.readFileSync(mediaPath, "utf-8"))
  }
} catch (e) {
  console.warn("Could not read processed_media.json, using defaults", e.message)
}

const sampleSongs = mediaData.songs.length > 0 ? mediaData.songs.map((s) => ({
  title: s.title,
  artist: s.artist,
  album: s.album,
  genre: s.genre,
  duration: s.duration,
  coverUrl: s.coverUrl,
  audioUrl: s.audioUrl,
  plays: s.plays,
  likes: s.likes,
  createdAt: new Date(),
  updatedAt: new Date()
})) : [
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    genre: "Pop",
    duration: "3:20",
    coverUrl: "/covers/blinding-lights.jpg",
    audioUrl: "/audio/blinding-lights.m4a",
    plays: 1500000,
    likes: 45000,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

const sampleArtists = mediaData.artists.length > 0 ? mediaData.artists.map((a) => ({
  name: a.name,
  genre: a.genre,
  bio: `Award-winning global artist with ${a.followers} followers worldwide.`,
  imageUrl: a.imageUrl,
  verified: a.verified,
  followers: parseInt(a.followers.replace(/[^0-9.]/g, '')) * 1000000 || 50000000,
  monthlyListeners: Math.round((parseInt(a.followers.replace(/[^0-9.]/g, '')) * 1000000 || 50000000) * 0.85),
  createdAt: new Date(),
  updatedAt: new Date()
})) : [
  {
    name: "The Weeknd",
    genre: "R&B, Pop",
    bio: "Canadian singer, songwriter, and record producer",
    imageUrl: "/artists/the-weeknd.jpg",
    verified: true,
    followers: 85200000,
    monthlyListeners: 75000000,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

const samplePlaylists = [
  {
    name: "Today's Top Hits",
    creator: "Riff",
    description: "The biggest songs right now across the globe.",
    coverUrl: "/playlists/top-hits.jpg",
    songs: sampleSongs.slice(0, 5),
    followers: "32.1M",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "RapCaviar & Pop Rising",
    creator: "Riff",
    description: "Chart-toppers and high energy hits.",
    coverUrl: "/playlists/rap-caviar.jpg",
    songs: sampleSongs.slice(3, 8),
    followers: "15.8M",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Pop Rising",
    creator: "Riff",
    description: "Who's next in the world of pop.",
    coverUrl: "/playlists/pop-rising.jpg",
    songs: sampleSongs.slice(2, 7),
    followers: "8.9M",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Chill Hits",
    creator: "Riff",
    description: "Kick back to these smooth, relaxing tracks.",
    coverUrl: "/playlists/chill-hits.jpg",
    songs: sampleSongs.slice(0, 6),
    followers: "12.3M",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function seedDatabase() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(dbName)

    // Clear existing data
    await db.collection("songs").deleteMany({})
    await db.collection("artists").deleteMany({})
    await db.collection("users").deleteMany({})
    await db.collection("playlists").deleteMany({})

    console.log("Cleared existing data")

    // Insert sample data
    await db.collection("songs").insertMany(sampleSongs)
    await db.collection("artists").insertMany(sampleArtists)
    await db.collection("playlists").insertMany(samplePlaylists)

    console.log(`Inserted ${sampleSongs.length} songs, ${sampleArtists.length} artists, and ${samplePlaylists.length} playlists`)

    // Create indexes
    await db.collection("songs").createIndex({ title: "text", artist: "text", album: "text" })
    await db.collection("artists").createIndex({ name: "text" })
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("playlists").createIndex({ creator: 1 })

    console.log("Created indexes")
    console.log("Database seeded successfully with real media!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
