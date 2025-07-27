"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await apiClient.login(email, password)
      setUser(response.user)
      localStorage.setItem("user", JSON.stringify(response.user))
      return response
    } catch (error) {
      throw error
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await apiClient.register(name, email, password)
      setUser(response.user)
      localStorage.setItem("user", JSON.stringify(response.user))
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
      setUser(null)
      localStorage.removeItem("user")
    } catch (error) {
      // Even if API call fails, clear local state
      setUser(null)
      localStorage.removeItem("user")
    }
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }
}
