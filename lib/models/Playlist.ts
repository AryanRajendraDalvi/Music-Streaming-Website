export interface Playlist {
  _id?: string
  name: string
  description?: string
  coverUrl: string
  songs: string[] // Array of song IDs
  creator: string // User ID
  isPublic: boolean
  followers: string[] // Array of user IDs
  createdAt: Date
  updatedAt: Date
}
