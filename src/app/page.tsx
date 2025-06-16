import { cookies } from "next/headers"
import { verifyJwt } from "@/lib/jwt"
import { fetchMovies, type MovieResult } from "@/lib/tmdb"
import HomepageClient from "@/components/homepage-client"

function mapMovies(arr: MovieResult[]) {
  return arr.map((m) => ({
    id: m.id,
    title: m.title || m.name || "Untitled",
    image: m.poster_path
      ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
      : "/placeholder.svg",
  }))
}

export default async function HomePage() {
  /* user initial — read JWT cookie on the server */
   const cookieStore = await cookies() 
  const token = cookieStore.get("token")?.value
  const payload = token ? verifyJwt<{ name?: string }>(token) : null
  const initial = payload?.name?.charAt(0).toUpperCase() ?? "U"

  /* movie data */
  const trending   = mapMovies(await fetchMovies("trending"))
  const popular    = mapMovies(await fetchMovies("popular"))
  const nowPlaying = mapMovies(await fetchMovies("now_playing"))

  const categories = [
    { title: "Trending Now",       movies: trending },
    { title: "Popular on Netflix", movies: popular },
    { title: "New Releases",       movies: nowPlaying },
  ]

  return <HomepageClient categories={categories} initial={initial} />
}
