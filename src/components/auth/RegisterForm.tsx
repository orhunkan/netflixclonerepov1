"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [remember, setRemember] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) return alert("Passwords don't match")

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    if (!res.ok) {
      alert(data.message || "Register failed")
      return
    }

    console.log("User registered:", data)
    // TODO: redirect
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url('/placeholder.svg?height=1080&width=1920')` }}
      >
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="absolute top-[-100px] left-6">
        <Link href="/">
          <Image src="/nextflix.png" alt="Nextflix" width={300} height={60} priority className="w-128 h-96" />
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 pt-32 pb-20">
        <div className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-sm p-16 rounded-md space-y-8">
            <h2 className="text-3xl font-bold text-white">Sign Up</h2>

            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

            <Button type="submit" className="w-full h-12 bg-[#e50914] hover:bg-[#f40612]">
              Sign Up
            </Button>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-[#b3b3b3]">
                <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
                <span>Remember me</span>
              </label>
              <Link href="#" className="text-[#b3b3b3] hover:underline">Need help?</Link>
            </div>

            <div className="text-[#737373]">
              Already have an account?{" "}
              <Link href="/login" className="text-white hover:underline">Sign in now</Link>.
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-black/30 backdrop-blur-sm p-3">
        <div className="max-w-6xl mx-auto text-[#737373] text-xs">
          <p className="mb-2">Questions? Call 1-844-505-2993</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["FAQ", "Help Center", "Terms of Use", "Privacy"].map(item => (
              <Link key={item} href="#" className="hover:underline">{item}</Link>
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
