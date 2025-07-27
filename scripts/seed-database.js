// This script seeds the database with initial data
const { MongoClient } = require("mongodb")

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const dbName = "streamflow"

const sampleSongs = [
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    genre: "Pop",
    duration: "3:20",
    coverUrl: "/placeholder.svg?height=200&width=200",
    audioUrl: "/placeholder-audio.mp3",
    plays: 1500000,
    likes: 45000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    genre: "Pop",
    duration: "2:54",
    coverUrl: "/placeholder.svg?height=200&width=200",
    audioUrl: "/placeholder-audio.mp3",
    plays: 1200000,
    likes: 38000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    genre: "Pop",
    duration: "3:23",
    coverUrl: "/placeholder.svg?height=200&width=200",
    audioUrl: "/placeholder-audio.mp3",
    plays: 980000,
    likes: 32000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    genre: "Pop Rock",
    duration: "2:58",
    coverUrl: "/placeholder.svg?height=200&width=200",
    audioUrl: "/placeholder-audio.mp3",
    plays: 850000,
    likes: 28000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Stay",
    artist: "The Kid LAROI & Justin Bieber",
    album: "F*CK LOVE 3",
    genre: "Pop",
    duration: "2:21",
    coverUrl: "/placeholder.svg?height=200&width=200",
    audioUrl: "/placeholder-audio.mp3",
    plays: 750000,
    likes: 25000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Heat Waves",
    artist: "Glass Animals",
    album: "Dreamland",
    genre: "Indie Pop",
    duration: "3:58",
    coverUrl: "/placeholder.svg?height=200&width=200",
    audioUrl: "/placeholder-audio.mp3",
    plays: 680000,
    likes: 22000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const sampleArtists = [
  {
    name: "The Weeknd",
    genre: "R&B, Pop",
    bio: "Canadian singer, songwriter, and record producer",
    imageUrl: "/placeholder.svg?height=200&width=200",
    verified: true,
    followers: 85200000,
    monthlyListeners: 75000000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Dua Lipa",
    genre: "Pop, Dance",
    bio: "English singer and songwriter",
    imageUrl: "/placeholder.svg?height=200&width=200",
    verified: true,
    followers: 73100000,
    monthlyListeners: 68000000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Harry Styles",
    genre: "Pop, Rock",
    bio: "English singer, songwriter, and actor",
    imageUrl: "/placeholder.svg?height=200&width=200",
    verified: true,
    followers: 68900000,
    monthlyListeners: 62000000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Olivia Rodrigo",
    genre: "Pop, Alternative",
    bio: "American singer-songwriter and actress",
    imageUrl: "/placeholder.svg?height=200&width=200",
    verified: true,
    followers: 45300000,
    monthlyListeners: 42000000,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
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

    console.log("Inserted sample songs and artists")

    // Create indexes
    await db.collection("songs").createIndex({ title: "text", artist: "text", album: "text" })
    await db.collection("artists").createIndex({ name: "text" })
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("playlists").createIndex({ creator: 1 })

    console.log("Created indexes")

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
