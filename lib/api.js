class ApiClient {
  constructor() {
    this.baseUrl = "/api"
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === "object") {
      config.body = JSON.stringify(config.body)
    }

    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "API request failed")
    }

    return data
  }

  // Auth methods
  async login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: { email, password },
    })
  }

  async register(name, email, password) {
    return this.request("/auth/register", {
      method: "POST",
      body: { name, email, password },
    })
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    })
  }

  // Songs methods
  async getSongs(params = {}) {
    const searchParams = new URLSearchParams(params)
    return this.request(`/songs?${searchParams}`)
  }

  async createSong(songData) {
    return this.request("/songs", {
      method: "POST",
      body: songData,
    })
  }

  async likeSong(songId) {
    return this.request(`/songs/${songId}/like`, {
      method: "POST",
    })
  }

  // Playlists methods
  async getPlaylists(params = {}) {
    const searchParams = new URLSearchParams(params)
    return this.request(`/playlists?${searchParams}`)
  }

  async createPlaylist(playlistData) {
    return this.request("/playlists", {
      method: "POST",
      body: playlistData,
    })
  }

  async addSongToPlaylist(playlistId, songId) {
    return this.request(`/playlists/${playlistId}/songs`, {
      method: "POST",
      body: { songId },
    })
  }
}

export const apiClient = new ApiClient()
