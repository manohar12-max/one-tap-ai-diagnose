"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Star, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  ChevronRight, 
  Award,
  Search,
  ShieldCheck,
  Activity,
  Loader2,
  Navigation,
  Phone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Props {
  specialty: string
  onBack: () => void
}

interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  reviews: number
  experience: string
  location: string
  distance: string
  image: string
  tags: string[]
  phone?: string
  lat?: number
  lng?: number
}

export function DoctorMatch({ specialty, onBack }: Props) {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationPermission, setLocationPermission] = useState<"prompt" | "granted" | "denied">("prompt")

  useEffect(() => {
    fetchDoctors()
  }, [specialty])

  const fetchDoctors = async (coords?: { lat: number; lng: number }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialty,
          lat: coords?.lat,
          lng: coords?.lng
        }),
      })

      if (!response.ok) throw new Error("Failed to fetch doctors")
      
      const data = await response.json()
      setDoctors(data.doctors || [])
    } catch (err) {
      console.error("Error fetching doctors:", err)
      setError("Could not find specialists nearby. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationPermission("granted")
        fetchDoctors({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (err) => {
        console.error("Geolocation error:", err)
        setLocationPermission("denied")
        setError("Location access denied. Showing results without distance filtering.")
        fetchDoctors() // Fetch without coordinates
      }
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-muted-foreground hover:text-primary -ml-4 gap-2 font-bold"
          >
            <ArrowLeft size={18} />
            Back to Diagnosis
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
               <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                Nearby <span className="text-primary">Specialists</span>
              </h2>
              {loading && <Loader2 size={24} className="animate-spin text-primary mt-2" />}
            </div>
            <p className="text-muted-foreground font-medium text-lg">
              Verified <span className="text-foreground font-black underline decoration-primary/30 decoration-4">{specialty}</span> specialists near your area.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} />
            Verified Providers
          </div>
          {locationPermission !== "granted" && (
            <Button 
              onClick={handleGetLocation}
              variant="outline" 
              size="sm" 
              className="rounded-full gap-2 text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5"
            >
              <Navigation size={12} />
              Enable Location
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-600 text-sm font-bold text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {loading ? (
            // Skeleton Loader
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 rounded-[2rem] bg-secondary/20 animate-pulse border border-border" />
            ))
          ) : doctors.length > 0 ? (
            doctors.map((doctor, i) => (
              <motion.div
                key={doctor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 bg-card border-border hover:border-primary/40 transition-all duration-300 rounded-[2rem] shadow-xl group hover:shadow-primary/5 h-full flex flex-col justify-between">
                  <div className="flex items-start gap-6">
                    <div className="relative shrink-0">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg bg-secondary">
                        <img 
                          src={doctor.image} 
                          alt={doctor.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 px-2 py-1 rounded-lg bg-background shadow-md flex items-center gap-1 text-primary border border-primary/20">
                         <Star size={12} fill="currentColor" className="text-yellow-500" />
                         <span className="text-[11px] font-black">{doctor.rating}</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">{doctor.name}</h3>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{doctor.specialty}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-tighter bg-primary/10 text-primary border-0">
                            {doctor.distance}
                          </Badge>
                          <span className="text-[9px] font-bold text-muted-foreground">{doctor.reviews} reviews</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {doctor.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-start gap-2 text-[11px] font-bold text-muted-foreground leading-snug">
                          <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                          {doctor.location}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                          <Award size={14} className="text-primary" />
                          {doctor.experience}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-base font-black text-foreground">{doctor.rating || "N/A"}</span>
                      <span className="text-[10px] font-bold text-muted-foreground">({doctor.reviews} reviews)</span>
                    </div>
                    <div className="flex gap-2">
                       <Button 
                        variant="ghost" 
                        size="icon"
                        className="rounded-xl border border-border hover:bg-secondary"
                        asChild
                      >
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(doctor.location)}`} target="_blank" rel="noopener noreferrer">
                          <Navigation size={18} className="text-primary" />
                        </a>
                      </Button>
                      <Button className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-xs shadow-lg shadow-primary/20 gap-2">
                        Book Now
                        <ChevronRight size={14} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4 bg-secondary/10 rounded-[3rem] border-2 border-dashed border-border">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                <Search size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-foreground">No specialists found</h3>
                <p className="text-muted-foreground font-medium">Try broadening your search or enabling location access.</p>
              </div>
              <Button onClick={() => fetchDoctors()} variant="outline" className="rounded-xl font-black">
                Retry Search
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <div className="p-6 bg-primary/5 rounded-[2.5rem] border border-primary/10 text-center max-w-lg">
          <p className="text-sm font-bold text-muted-foreground mb-4 italic">"Early consultation with a specialist can significantly improve treatment outcomes."</p>
          <Button variant="outline" className="rounded-2xl h-12 px-8 border-primary/20 text-primary font-black gap-2 hover:bg-primary hover:text-white transition-all">
            <Search size={18} />
            Browse All Specialists
          </Button>
        </div>
      </div>
    </div>
  )
}

