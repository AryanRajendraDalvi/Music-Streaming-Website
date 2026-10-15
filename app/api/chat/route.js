import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { messages, currentSong, catalog } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages array" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY

    // If API key is not yet configured, provide helpful music concierge response with catalog matches
    if (!apiKey || apiKey === "your_gemini_api_key_here" || apiKey.trim() === "") {
      const lastUserMsg = (messages[messages.length - 1]?.content || "").toLowerCase()
      
      let matchedSongs = []
      if (catalog && Array.isArray(catalog)) {
        if (lastUserMsg.includes("chill") || lastUserMsg.includes("relax") || lastUserMsg.includes("sleep") || lastUserMsg.includes("night")) {
          matchedSongs = catalog.filter(s => ["Watermelon Sugar", "Heat Waves", "As It Was", "Cruel Summer"].includes(s.title))
        } else if (lastUserMsg.includes("workout") || lastUserMsg.includes("energy") || lastUserMsg.includes("party") || lastUserMsg.includes("upbeat")) {
          matchedSongs = catalog.filter(s => ["Blinding Lights", "Levitating", "good 4 u", "STAY", "Don't Start Now"].includes(s.title))
        } else if (lastUserMsg.includes("pop") || lastUserMsg.includes("hit")) {
          matchedSongs = catalog.filter(s => ["Levitating", "Blinding Lights", "Shape of You", "bad guy"].includes(s.title))
        } else {
          matchedSongs = catalog.slice(0, 3)
        }
      }

      return NextResponse.json({
        message: `🎵 **RiffBot**:\n\nTo unlock live real-time Gemini AI recommendations, please add your **GEMINI_API_KEY** in your \`.env.local\` file.\n\nBased on your query *"${messages[messages.length - 1]?.content || 'music'}"*, here are some curated picks from the Riff library you can play right now:`,
        recommendedSongs: matchedSongs,
        apiKeyMissing: true
      })
    }

    // Build catalog context for Gemini
    const catalogSummary = (catalog || []).map((s) => ({
      id: s.id || s._id,
      title: s.title,
      artist: s.artist,
      album: s.album,
      genre: s.genre,
      duration: s.duration
    }))

    const systemPrompt = `You are "RiffBot", an expert personal music curator and concierge embedded inside the "Riff" music streaming platform.
Your goal is to understand the user's mood, taste, activity, favorite artists, or genres and provide personalized, engaging music recommendations.

Available Catalog in Riff:
${JSON.stringify(catalogSummary, null, 2)}

${currentSong ? `User is currently listening to: "${currentSong.title}" by ${currentSong.artist} (${currentSong.genre}).` : ""}

Guidelines:
1. Always suggest 1 to 4 songs from the Available Catalog above whenever they fit the user's query, and format their exact titles like [[Song Title]] so the app can create an interactive one-click play button for them!
2. You can also recommend popular external songs or albums, explaining why they match the user's vibe.
3. Be enthusiastic, concise, culturally aware of music trends, and friendly.
4. If the user asks for workouts, study, heartbreak, road trip, late night, etc., tailor the tempo, energy, and lyrical mood accordingly.
5. Keep responses concise (2 to 4 paragraphs max) with clear bullet points.`

    // Format chat history for Gemini API
    const geminiContents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }))

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: geminiContents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error("Gemini API error:", errText)
      return NextResponse.json({
        message: "I encountered an error connecting to Gemini. Please verify your GEMINI_API_KEY.",
        error: errText
      }, { status: 500 })
    }

    const data = await response.json()
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a recommendation right now."

    // Detect if any catalog songs were mentioned in the reply
    const mentionedSongs = (catalog || []).filter(s => {
      const titleLower = s.title.toLowerCase()
      return replyText.toLowerCase().includes(titleLower) || replyText.includes(`[[${s.title}]]`)
    })

    return NextResponse.json({
      message: replyText,
      recommendedSongs: mentionedSongs,
      apiKeyMissing: false
    })
  } catch (error) {
    console.error("Chatbot API error:", error)
    return NextResponse.json({ error: "Failed to generate recommendation" }, { status: 500 })
  }
}
