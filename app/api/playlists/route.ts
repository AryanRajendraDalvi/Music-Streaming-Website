import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import type { Playlist } from "@/lib/models/Playlist"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const isPublic = searchParams.get("public") === "true"

    const db = await getDatabase()
    const playlistsCollection = db.collection<Playlist>("playlists")

    const query: any = {}
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
    console.error("Get playlists error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { name, description, isPublic = false } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Playlist name is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const playlistsCollection = db.collection<Playlist>("playlists")

    const newPlaylist: Omit<Playlist, "_id"> = {
      name,
      description,
      coverUrl: "/placeholder.svg?height=200&width=200",
      songs: [],
      creator: decoded.userId,
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
