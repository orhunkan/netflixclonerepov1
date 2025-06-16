"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Movie {
  id: number
  title: string
  image: string
}

export default function MovieCarousel({
  title,
  movies,
}: {
  title: string
  movies: Movie[]
}) {
  const [scrollPosition, setScrollPosition] = useState(0)

  // scroll logic
  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById(`carousel-${title.replace(/\s+/g, "-")}`)
    if (!container) return

    const amount = 300
    const newPos = direction === "left"
      ? Math.max(0, scrollPosition - amount)
      : scrollPosition + amount

    container.scrollTo({ left: newPos, behavior: "smooth" })
    setScrollPosition(newPos)
  }

  return (
    <div className="mb-8">
      <h2 className="text-white text-xl font-semibold mb-4 px-4 md:px-12">{title}</h2>

      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div
          id={`carousel-${title.replace(/\s+/g, "-")}`}
          className="flex overflow-x-auto scrollbar-hide space-x-2 px-4 md:px-12 pb-4"
        >
          {movies.map((m) => (
            <div
              key={m.id}
              className="flex-shrink-0 w-48 cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              <img
                src={m.image}
                alt={m.title}
                className="w-full h-72 object-cover rounded-md"
              />
              <p className="text-white text-sm mt-2 truncate">{m.title}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
