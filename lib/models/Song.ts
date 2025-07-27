export interface Song {
  _id?: string
  title: string
  artist: string
  album: string
  duration: string
  coverUrl: string
  audioUrl: string
  genre: string
  releaseDate: Date
  plays: number
  likes: number
  createdAt: Date
  updatedAt: Date
}
