"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-11 h-11 rounded-xl">
        <div className="h-5 w-5 rounded-full border-2 border-primary/20" />
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="w-11 h-11 rounded-xl hover:bg-secondary/80 transition-all active:scale-90 relative overflow-hidden"
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5 text-primary animate-in fade-in zoom-in duration-300" />
      ) : (
        <Sun className="h-5 w-5 text-primary animate-in fade-in zoom-in duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
