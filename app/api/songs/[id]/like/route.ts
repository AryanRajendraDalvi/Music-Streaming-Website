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

    const db = await getDatabase()
    const usersCollection = db.collection("users")
    const songsCollection = db.collection("songs")

    const songId = params.id
    const userId = decoded.userId

    // Check if song exists
    const song = await songsCollection.findOne({ _id: new ObjectId(songId) })
    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 })
    }

    // Get user
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isLiked = user.likedSongs?.includes(songId)

    if (isLiked) {
      // Unlike song
      await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $pull: { likedSongs: songId } })
      await songsCollection.updateOne({ _id: new ObjectId(songId) }, { $inc: { likes: -1 } })
    } else {
      // Like song
      await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $addToSet: { likedSongs: songId } })
      await songsCollection.updateOne({ _id: new ObjectId(songId) }, { $inc: { likes: 1 } })
    }

    return NextResponse.json({
      message: isLiked ? "Song unliked" : "Song liked",
      liked: !isLiked,
    })
  } catch (error) {
    console.error("Like song error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
