"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Sparkles, MessageSquare, X, Send, Play, Music, Bot, User, Key } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const QUICK_PROMPTS = [
  "⚡ High energy workout playlist",
  "🌙 Late night chill & study",
  "🔥 Songs with vibes like The Weeknd",
  "🎉 Upbeat weekend party hits",
]

export default function MusicChatbot({ songs = [], onPlaySong, currentSong }) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey there! 🎵 I'm your **StreamFlow AI Concierge**, powered by Google Gemini.\n\nTell me your current mood, activity, or favorite artists, and I'll curate personalized recommendations you can play right now!",
      recommendedSongs: [],
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen])

  const handleSend = async (queryText) => {
    const textToSend = queryText || input
    if (!textToSend.trim() || isLoading) return

    const newMessages = [...messages, { role: "user", content: textToSend }]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          currentSong,
          catalog: songs,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.apiKeyMissing) {
          setApiKeyMissing(true)
        }
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            recommendedSongs: data.recommendedSongs || [],
          },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message || "Sorry, I couldn't connect to Gemini. Please check your GEMINI_API_KEY.",
            recommendedSongs: [],
          },
        ])
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error occurred while contacting the AI concierge. Please check your connection.",
          recommendedSongs: [],
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Helper to parse [[Song Name]] in markdown and format nicely
  const renderMessageContent = (content) => {
    const cleanContent = content.replace(/\[\[(.*?)\]\]/g, "**$1**")
    return cleanContent
  }

  return (
    <div className="fixed bottom-24 right-6 z-40">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 px-5 shadow-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center space-x-2 border border-white/20 hover:scale-105 transition-all"
        >
          <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
          <span className="font-semibold text-sm">Ask AI Concierge</span>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-[380px] sm:w-[420px] h-[550px] shadow-2xl flex flex-col border border-border/80 bg-background/95 backdrop-blur-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <CardHeader className="p-4 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 border-b flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm">StreamFlow AI</h3>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-blue-500/50 text-blue-500 font-mono">
                    Gemini
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Personalized Music Recommendations</p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          {/* Messages Body */}
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
            {messages.map((m, index) => (
              <div
                key={index}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-muted/80 text-foreground border rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{renderMessageContent(m.content)}</p>

                  {/* Playable Song Cards embedded in AI response */}
                  {m.recommendedSongs && m.recommendedSongs.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-border/40 space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Recommended Songs
                      </p>
                      <div className="space-y-1.5">
                        {m.recommendedSongs.map((song, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-center justify-between p-2 rounded-lg bg-background/80 hover:bg-background border border-border/50 transition-colors"
                          >
                            <div className="flex items-center space-x-2.5 min-w-0 mr-2">
                              <img
                                src={song.coverUrl || "/placeholder.svg"}
                                alt={song.title}
                                className="w-8 h-8 rounded object-cover flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-medium text-xs truncate">{song.title}</p>
                                <p className="text-[11px] text-muted-foreground truncate">{song.artist}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              className="h-7 px-2.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md flex-shrink-0"
                              onClick={() => onPlaySong && onPlaySong(song)}
                            >
                              <Play className="h-3 w-3 mr-1 fill-white" />
                              Play
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-muted-foreground text-xs py-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce [animation-delay:0.4s]" />
                <span>Gemini is curating songs for you...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t bg-muted/30">
              <p className="text-[11px] font-medium text-muted-foreground mb-1.5">Try asking:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSend(prompt)}
                    className="text-xs bg-background hover:bg-muted border border-border/70 rounded-full px-2.5 py-1 text-left transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Input */}
          <CardFooter className="p-3 border-t bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center space-x-2 w-full"
            >
              <Input
                placeholder="Ask for vibes, mood, or songs..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 text-sm bg-muted/40 focus-visible:ring-blue-500"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white h-9 w-9 flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
