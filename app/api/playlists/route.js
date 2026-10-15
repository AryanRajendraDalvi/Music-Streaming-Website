import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { DEFAULT_PLAYLISTS } from "@/lib/default-data"

export async function GET(request) {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({
      playlists: DEFAULT_PLAYLISTS,
    })
  }

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const isPublic = searchParams.get("public") === "true"

    const db = await getDatabase()
    const playlistsCollection = db.collection("playlists")

    const query = {}
    if (userId) {
      query.creator = userId
    }
    if (isPublic) {
      query.isPublic = true
    }

    const playlists = await playlistsCollection.find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      playlists: playlists.map((playlist) => ({
        ...playlist,
        _id: playlist._id?.toString(),
      })),
    })
  } catch (error) {
    console.warn("MongoDB unavailable, returning default playlists:", error.message)
    return NextResponse.json({
      playlists: DEFAULT_PLAYLISTS,
    })
  }
}

export async function POST(request) {
  try {
    const { name, description, isPublic = false } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Playlist name is required" }, { status: 400 })
    }

    if (!process.env.MONGODB_URI) {
      const fallbackPlaylist = {
        _id: "playlist-" + Date.now(),
        name,
        description: description || "",
        coverUrl: "/playlists/top-hits.jpg",
        songs: [],
        creator: "local-user",
        isPublic,
        followers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      return NextResponse.json({
        message: "Playlist created successfully (standalone mode)",
        playlist: fallbackPlaylist,
      })
    }

    // Get token from cookie
    const token = request.cookies.get("token")?.value
    let userId = "guest"
    if (token) {
      const decoded = verifyToken(token)
      if (decoded) userId = decoded.userId
    }

    const db = await getDatabase()
    const playlistsCollection = db.collection("playlists")

    const newPlaylist = {
      name,
      description,
      coverUrl: "/playlists/top-hits.jpg",
      songs: [],
      creator: userId,
      isPublic,
      followers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await playlistsCollection.insertOne(newPlaylist)

    return NextResponse.json({
      message: "Playlist created successfully",
      playlist: {
        ...newPlaylist,
        _id: result.insertedId.toString(),
      },
    })
  } catch (error) {
    console.error("Create playlist error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
