"use client"

import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export default function ProfileDropdown({ initial }: { initial: string }) {
  const router = useRouter()

  // logout → clear cookie via API then redirect
  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-[#e50914] rounded flex items-center justify-center">
            <span className="text-white text-sm font-semibold">{initial}</span>
          </div>
          <ChevronDown className="w-4 h-4 text-white" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40 bg-black text-white">
        <DropdownMenuItem onClick={handleLogout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
