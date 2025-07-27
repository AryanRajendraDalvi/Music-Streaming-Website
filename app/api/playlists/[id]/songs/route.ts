import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { songId } = await request.json()
    const playlistId = params.id

    if (!songId) {
      return NextResponse.json({ error: "Song ID is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const playlistsCollection = db.collection("playlists")
    const songsCollection = db.collection("songs")

    // Check if playlist exists and user owns it
    const playlist = await playlistsCollection.findOne({
      _id: new ObjectId(playlistId),
      creator: decoded.userId,
    })

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found or access denied" }, { status: 404 })
    }

    // Check if song exists
    const song = await songsCollection.findOne({ _id: new ObjectId(songId) })
    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 })
    }

    // Add song to playlist (avoid duplicates)
    await playlistsCollection.updateOne(
      { _id: new ObjectId(playlistId) },
      {
        $addToSet: { songs: songId },
        $set: { updatedAt: new Date() },
      },
    )

    return NextResponse.json({
      message: "Song added to playlist successfully",
    })
  } catch (error) {
    console.error("Add song to playlist error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
