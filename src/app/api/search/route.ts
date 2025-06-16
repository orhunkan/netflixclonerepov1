// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server"
import { searchMovies } from "@/lib/tmdb"

const API_KEY = process.env.TMDB_API_KEY!
const BASE_URL = "https://api.themoviedb.org/3"

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim() ?? ""
  if (!query) return NextResponse.json({ results: [] })

  // Search movies from TMDB
  const results = await searchMovies(query)

  // Filter first 30 results that start with query
  const filtered = results
    .filter((m) => (m.title || m.name || "").toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 30)

  // Fetch IMDb IDs via external_ids endpoint
  const enriched = await Promise.all(
    filtered.map(async (movie) => {
      try {
        const res = await fetch(`${BASE_URL}/movie/${movie.id}/external_ids?api_key=${API_KEY}`)
        const ids = await res.json()
        return { ...movie, imdb_id: ids.imdb_id as string | null }
      } catch {
        return { ...movie, imdb_id: null }
      }
    })
  )

  return NextResponse.json({ results: enriched })
}
