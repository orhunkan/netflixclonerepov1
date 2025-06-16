/* lib/tmdb.ts
 * Wrapper helpers for The Movie Database (TMDB) API
 */

const API_KEY   = process.env.TMDB_API_KEY
const BASE_URL  = "https://api.themoviedb.org/3"

// movie object shape returned by TMDB
export interface MovieResult {
  id: number
  title?: string      // movies
  name?: string       // tv-shows
  poster_path: string | null
  overview?: string
  release_date?: string
}

/* ---------- fetch weekly / category lists ---------- */
export async function fetchMovies(category: string = "trending"): Promise<MovieResult[]> {
  const endpoint =
    category === "trending"
      ? "/trending/movie/week"
      : `/movie/${category}`

  const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US`, {
    next: { revalidate: 60 * 60 },          // cache for 1 h
  })

  if (!res.ok) throw new Error("TMDB fetch failed")
  const data = await res.json()
  return data.results as MovieResult[]
}

/* ---------- free-text search (first 30 titles) ---------- */
export async function searchMovies(query: string): Promise<MovieResult[]> {
  if (!query.trim()) return []

  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
    query
  )}&language=en-US`

  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error("TMDB search failed")

  // keep only titles that start with the query and limit to 30 items
  const data = (await res.json()).results as MovieResult[]
  return data
    .filter((m) => (m.title || m.name || "").toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, 30)
}
