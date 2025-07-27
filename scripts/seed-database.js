// This script seeds the database with initial data
const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "streamflow"

const mockSongs = [
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    coverUrl: "/placeholder.svg?height=200&width=200",
    audioUrl: "/placeholder-audio.mp3",
    genre: "Pop",
    releaseDate: new Date("2019-11-29"),
    plays: 2500000,
    likes: 150000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: "2:54",
    coverUrl: "/placeholder.svg?height=200&width=200",
    audioUrl: "/placeholder-audio.mp3",
    genre: "Pop",
    releaseDate: new Date("2020-05-18"),
    plays: 1800000,
    likes: 120000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:23",
    coverUrl: "/placeholder.svg?height=200&width=200",
    audioUrl: "/placeholder-audio.mp3",
    genre: "Pop",
    releaseDate: new Date("2020-03-27"),
    plays: 2200000,
    likes: 180000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    duration: "2:58",
    coverUrl: "/placeholder.svg?height=200&width=200",
    audioUrl: "/placeholder-audio.mp3",
    genre: "Pop",
    releaseDate: new Date("2021-05-14"),
    plays: 1900000,
    likes: 140000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockArtists = [
  {
    name: "The Weeknd",
    bio: "Canadian singer, songwriter, and record producer",
    genre: ["R&B", "Pop", "Alternative"],
    imageUrl: "/placeholder.svg?height=200&width=200",
    verified: true,
    followers: [],
    albums: [],
    monthlyListeners: 85200000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Dua Lipa",
    bio: "English singer and songwriter",
    genre: ["Pop", "Dance", "Electronic"],
    imageUrl: "/placeholder.svg?height=200&width=200",
    verified: true,
    followers: [],
    albums: [],
    monthlyListeners: 73100000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(DB_NAME)

    // Clear existing data
    await db.collection("songs").deleteMany({})
    await db.collection("artists").deleteMany({})

    // Insert songs
    const songsResult = await db.collection("songs").insertMany(mockSongs)
    console.log(`Inserted ${songsResult.insertedCount} songs`)

    // Insert artists
    const artistsResult = await db.collection("artists").insertMany(mockArtists)
    console.log(`Inserted ${artistsResult.insertedCount} artists`)

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("songs").createIndex({ title: "text", artist: "text", album: "text" })
    await db.collection("playlists").createIndex({ creator: 1 })

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
