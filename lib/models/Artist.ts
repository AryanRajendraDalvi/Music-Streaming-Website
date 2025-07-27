export interface Artist {
  _id?: string
  name: string
  bio?: string
  genre: string[]
  imageUrl: string
  verified: boolean
  followers: string[] // Array of user IDs
  albums: string[] // Array of album IDs
  monthlyListeners: number
  createdAt: Date
  updatedAt: Date
}
