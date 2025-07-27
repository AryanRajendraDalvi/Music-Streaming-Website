import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"
import type { User } from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection<User>("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const newUser: Omit<User, "_id"> = {
      name,
      email,
      password: hashedPassword,
      plan: "free",
      joinDate: new Date(),
      likedSongs: [],
      playlists: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(newUser)
    const userId = result.insertedId.toString()

    // Generate token
    const token = generateToken(userId)

    // Return user data (without password)
    const userResponse = {
      _id: userId,
      name,
      email,
      plan: "free",
      joinDate: newUser.joinDate,
      likedSongs: [],
      playlists: [],
    }

    const response = NextResponse.json({
      message: "User created successfully",
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
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
