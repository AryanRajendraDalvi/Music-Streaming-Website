import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (!process.env.MONGODB_URI) {
      // Standalone mode: accept login with mock user
      const name = email.split("@")[0] || "User"
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1)
      const token = generateToken("demo-user-id")
      const userResponse = {
        _id: "demo-user-id",
        name: capitalized,
        email,
        avatar: "/placeholder.svg?height=100&width=100",
        plan: "premium",
        joinDate: new Date().toISOString(),
        likedSongs: ["1", "3", "5"],
        playlists: [],
      }

      const response = NextResponse.json({
        message: "Login successful (standalone demo)",
        user: userResponse,
        token,
      })

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
      })

      return response
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    // Find user
    const user = await usersCollection.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate token
    const token = generateToken(user._id.toString())

    // Return user data (without password)
    const userResponse = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      plan: user.plan,
      joinDate: user.joinDate,
      likedSongs: user.likedSongs,
      playlists: user.playlists,
    }

    const response = NextResponse.json({
      message: "Login successful",
      user: userResponse,
      token,
    })

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
