export interface User {
  _id?: string
  name: string
  email: string
  password: string
  avatar?: string
  plan: "free" | "premium" | "family"
  joinDate: Date
  likedSongs: string[]
  playlists: string[]
  createdAt: Date
  updatedAt: Date
}

export interface UserResponse {
  _id: string
  name: string
  email: string
  avatar?: string
  plan: "free" | "premium" | "family"
  joinDate: Date
  likedSongs: string[]
  playlists: string[]
}
