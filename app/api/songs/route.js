import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const genre = searchParams.get("genre") || ""

    const db = await getDatabase()
    const songsCollection = db.collection("songs")

    // Build query
    const query = {}
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { artist: { $regex: search, $options: "i" } },
        { album: { $regex: search, $options: "i" } },
      ]
    }
    if (genre) {
      query.genre = genre
    }

    // Get total count
    const total = await songsCollection.countDocuments(query)

    // Get songs with pagination
    const songs = await songsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      songs: songs.map((song) => ({
        ...song,
        _id: song._id?.toString(),
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get songs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const songData = await request.json()

    const db = await getDatabase()
    const songsCollection = db.collection("songs")

    const newSong = {
      ...songData,
      plays: 0,
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await songsCollection.insertOne(newSong)

    return NextResponse.json({
      message: "Song created successfully",
      song: {
        ...newSong,
        _id: result.insertedId.toString(),
      },
    })
  } catch (error) {
    console.error("Create song error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
