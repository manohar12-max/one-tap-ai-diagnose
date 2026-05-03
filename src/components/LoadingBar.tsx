"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { HeartPulse } from "lucide-react"

export function LoadingBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Show loader on any path or search change
    setLoading(true)
    
    // Auto-hide after a realistic navigation window or when the component re-renders on new page
    const timeout = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timeout)
  }, [pathname, searchParams])

  return (
    <AnimatePresence>
      {loading && (
        <>
          {/* Top Progress Bar */}
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed top-0 left-0 h-1.5 bg-primary z-[10000] shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          />
          
          {/* Full Screen Overlay Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/40 backdrop-blur-md pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card/80 p-8 rounded-[2.5rem] border border-primary/20 shadow-2xl flex flex-col items-center gap-4"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="bg-primary text-white p-4 rounded-2xl"
                >
                  <HeartPulse size={32} />
                </motion.div>
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Initializing OTAD Engine</p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
