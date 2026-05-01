"use client"

import { motion } from "framer-motion"
import {
  Stethoscope,
  FlaskConical,
  Syringe,
  Pill,
  Microscope,
  Atom,
  Dna,
  HeartPulse,
  Thermometer,
  ClipboardCheck
} from "lucide-react"
import { usePathname } from "next/navigation"

export function MedicalBackground() {
  const pathname = usePathname()

  if (pathname === "/admin") return null

  const watermarks = [
    { Icon: FlaskConical, x: "10%", y: "15%", rotate: -15, size: 160 },
    { Icon: Stethoscope, x: "85%", y: "20%", rotate: 15, size: 180 },
    { Icon: Syringe, x: "15%", y: "55%", rotate: 45, size: 140 },
    { Icon: Atom, x: "80%", y: "50%", rotate: -10, size: 160 },
    { Icon: Dna, x: "10%", y: "85%", rotate: 20, size: 200 },
    { Icon: Pill, x: "90%", y: "80%", rotate: -30, size: 150 },
    { Icon: Microscope, x: "35%", y: "75%", rotate: -12, size: 130 },
    { Icon: HeartPulse, x: "45%", y: "30%", rotate: 0, size: 120 },
    { Icon: Thermometer, x: "65%", y: "85%", rotate: 10, size: 130 },
    { Icon: ClipboardCheck, x: "60%", y: "60%", rotate: -5, size: 140 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden select-none bg-background transition-colors duration-700">
      <div className="absolute inset-0 z-0">
        {watermarks.map((item, index) => (
          <motion.div
            key={index}
            className="absolute text-primary/25 dark:text-primary/35"
            style={{
              left: item.x,
              top: item.y,
            }}
            initial={{ opacity: 0, scale: 1 }}
            animate={{
              opacity: 1,
              scale: [1, 1.15, 1],
              rotate: [item.rotate, item.rotate + 3, item.rotate]
            }}
            transition={{
              duration: 8 + index,
              repeat: Infinity,
              delay: index * 0.4,
              ease: "easeInOut"
            }}
          >
            <item.Icon
              size={item.size}
              strokeWidth={1.5}
            />
          </motion.div>
        ))}
      </div>
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full opacity-35" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full opacity-35" />
    </div>
  )
}
