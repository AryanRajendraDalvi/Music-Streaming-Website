// Client-side API functions
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export class ApiClient {
  private baseUrl = "/api"

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || "An error occurred" }
      }

      return { data, message: data.message }
    } catch (error) {
      return { error: "Network error occurred" }
    }
  }

  // Auth methods
  async register(userData: { name: string; email: string; password: string }) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: { email: string; password: string }) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async logout() {
    return this.request("/auth/logout", { method: "POST" })
  }

  // Songs methods
  async getSongs(params?: {
    page?: number
    limit?: number
    search?: string
    genre?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())
    if (params?.search) searchParams.set("search", params.search)
    if (params?.genre) searchParams.set("genre", params.genre)

    return this.request(`/songs?${searchParams.toString()}`)
  }

  async likeSong(songId: string) {
    return this.request(`/songs/${songId}/like`, { method: "POST" })
  }

  // Playlists methods
  async getPlaylists(userId?: string, isPublic?: boolean) {
    const searchParams = new URLSearchParams()
    if (userId) searchParams.set("userId", userId)
    if (isPublic) searchParams.set("public", "true")

    return this.request(`/playlists?${searchParams.toString()}`)
  }

  async createPlaylist(playlistData: {
    name: string
    description?: string
    isPublic?: boolean
  }) {
    return this.request("/playlists", {
      method: "POST",
      body: JSON.stringify(playlistData),
    })
  }

  async addSongToPlaylist(playlistId: string, songId: string) {
    return this.request(`/playlists/${playlistId}/songs`, {
      method: "POST",
      body: JSON.stringify({ songId }),
    })
  }
}

export const apiClient = new ApiClient()
