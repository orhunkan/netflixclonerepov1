"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || "Login failed")
      return
    }

    router.push("/")
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* background image */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url('/placeholder.svg?height=1080&width=1920')` }}
      >
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* logo */}
      <div className="absolute top-[-100px] left-6">
        <Link href="/">
          <Image
            src="/nextflix.png"
            alt="Nextflix"
            width={300}
            height={60}
            priority
            className="w-128 h-96"
          />
        </Link>
      </div>

      {/* form */}
      <main className="flex-1 flex items-center justify-center px-4 pt-32 pb-20">
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit}
            className="bg-black/40 backdrop-blur-sm p-16 rounded-md space-y-8"
          >
            <h2 className="text-3xl font-bold text-white">Sign In</h2>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`transition bg-black/50 text-white placeholder:text-gray-400 border-white/20 ${
            email ? "bg-white text-black" : ""
          }`}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`transition bg-black/50 text-white placeholder:text-gray-400 border-white/20 ${
            password ? "bg-white text-black" : ""
          }`}
          required
        />

            <Button type="submit" className="w-full h-12 bg-[#e50914] hover:bg-[#f40612]">
              Sign In
            </Button>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-[#b3b3b3]">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(!!v)}
                />
                <span>Remember me</span>
              </label>
              <Link href="#" className="text-[#b3b3b3] hover:underline">
                Need help?
              </Link>
            </div>

            <div className="text-[#737373]">
              New to Nextflix?{" "}
              <Link href="/register" className="text-white hover:underline">
                Sign up now
              </Link>
              .
            </div>
          </form>
        </div>
      </main>

      {/* footer */}
      <footer className="bg-black/30 backdrop-blur-sm p-3">
        <div className="max-w-6xl mx-auto text-[#737373] text-xs">
          <p className="mb-2">Questions? Call 1-844-505-2993</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["FAQ", "Help Center", "Terms of Use", "Privacy"].map((item) => (
              <Link key={item} href="#" className="hover:underline">
                {item}
              </Link>
            ))}
          </div>
          <div className="mt-2">
            <select className="bg-transparent border border-[#737373] px-2 py-1 rounded-sm">
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </footer>
    </div>
  )
}
