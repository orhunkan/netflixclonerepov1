"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Play, Info, Search, Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MovieCarousel from "./movie-carousel"

/* ---------- type definitions ---------- */
interface SearchMovie {
  id: number
  title: string
  image: string
  imdb_id: string | null
}

interface Movie {
  id: number
  title: string
  image: string
}

interface Category {
  title: string
  movies: Movie[]
}

interface Props {
  categories: Category[]
  initial?: string
}

/* ---------- component ---------- */
export default function HomepageClient({ categories, initial = "?" }: Props) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchMovie[]>([])
  const router = useRouter()

  /* close dropdown when clicking outside */
  useEffect(() => {
    function handler(evt: MouseEvent) {
      const target = evt.target as HTMLElement
      if (!target.closest("#profile-dropdown")) setDropdownOpen(false)
    }
    window.addEventListener("click", handler)
    return () => window.removeEventListener("click", handler)
  }, [])

  /* logout */
  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" })
    router.push("/login")
  }

  /* live search (debounced) */
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = (await res.json()) as {
          results: {
            id: number
            title?: string
            name?: string
            poster_path: string | null
            imdb_id: string | null
          }[]
        }

        setResults(
          data.results.map((m) => ({
            id: m.id,
            title: m.title ?? m.name ?? "Untitled",
            image: m.poster_path
              ? `https://image.tmdb.org/t/p/w200${m.poster_path}`
              : "/placeholder.svg",
            imdb_id: m.imdb_id,
          }))
        )
      } catch (err) {
        console.error("Search error:", err)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="bg-black min-h-screen">
      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent px-4 md:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* logo & nav */}
          <div className="flex items-center space-x-8">
            <Link href="/">
              <img src="/nextflix.png" alt="Nextflix" className="h-16 md:h-20" />
            </Link>
            <nav className="hidden md:flex space-x-6">
              {["Home", "TV Shows", "Movies", "New & Popular", "My List"].map((n) => (
                <Link key={n} href="#" className="text-white hover:text-gray-300">
                  {n}
                </Link>
              ))}
            </nav>
          </div>

          {/* actions */}
          <div className="flex items-center space-x-4 relative">
            {/* search input */}
            {searchOpen ? (
              <>
                <Input
                  type="text"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => !query && setSearchOpen(false)}
                  className={`w-64 border-white/20 placeholder:text-gray-400 ${
                    query ? "bg-white text-black" : "bg-black/50 text-white"
                  }`}
                  autoFocus
                />
                {/* search dropdown */}
                {results.length > 0 && (
                  <div className="absolute top-14 right-0 bg-[#141414] border border-gray-700 w-80 rounded shadow-lg z-50 max-h-96 overflow-y-auto">
                    {results.map((m) => (
                      <Link
                        key={m.id}
                        href={
                          m.imdb_id
                            ? `https://www.imdb.com/title/${m.imdb_id}`
                            : `https://www.themoviedb.org/movie/${m.id}`
                        }
                        target="_blank"
                        className="flex items-center space-x-3 p-2 hover:bg-gray-700"
                      >
                        <img
                          src={m.image}
                          alt={m.title}
                          className="w-10 h-16 object-cover rounded"
                        />
                        <span className="text-white text-sm">{m.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="text-white hover:text-gray-300">
                <Search className="w-6 h-6" />
              </button>
            )}

            {/* notification bell */}
            <button className="text-white hover:text-gray-300">
              <Bell className="w-6 h-6" />
            </button>

            {/* profile dropdown */}
            <div id="profile-dropdown" className="relative">
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div className="w-8 h-8 bg-[#e50914] rounded flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{initial}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-white" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#141414] border border-gray-700 rounded shadow-lg z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
        >
          <source src="/videos/stranger-trailer.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <div className="relative z-10 px-4 md:px-12 max-w-2xl">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">Stranger Things</h1>
          <p className="text-white text-lg md:text-xl mb-6 leading-relaxed">
            When a young boy vanishes, a small town uncovers a mystery involving secret experiments,
            terrifying supernatural forces, and one strange little girl.
          </p>
          <div className="flex space-x-4">
            <Button className="bg-white hover:bg-gray-200 text-black font-semibold px-8 py-3 rounded flex items-center space-x-2">
              <Play className="w-5 h-5 fill-current" />
              <span>Play</span>
            </Button>
            <Button className="bg-gray-500/70 hover:bg-gray-500/90 text-white font-semibold px-8 py-3 rounded flex items-center space-x-2">
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </Button>
          </div>
        </div>
      </section>

      {/* CAROUSELS */}
      <section className="relative z-10 -mt-32 pb-20">
        {categories.map((c) => (
          <MovieCarousel key={c.title} title={c.title} movies={c.movies} />
        ))}
      </section>

      {/* FOOTER */}
      <footer className="bg-black px-4 md:px-12 py-12">
        <div className="max-w-6xl mx-auto text-gray-400 text-sm">
          <p>© 2024 Netflix, Inc.</p>
        </div>
      </footer>
    </div>
  )
}
