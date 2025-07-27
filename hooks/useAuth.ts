"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"

interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  plan: "free" | "premium" | "family"
  joinDate: Date
  likedSongs: string[]
  playlists: string[]
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (you can implement a /me endpoint)
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await apiClient.login({ email, password })
    if (response.data) {
      setUser(response.data.user)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      return { success: true }
    }
    return { success: false, error: response.error }
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await apiClient.register({ name, email, password })
    if (response.data) {
      setUser(response.data.user)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      return { success: true }
    }
    return { success: false, error: response.error }
  }

  const logout = async () => {
    await apiClient.logout()
    setUser(null)
    localStorage.removeItem("user")
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }
}
