"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  MapPin, 
  Stethoscope, 
  ShieldCheck, 
  ChevronRight, 
  Star, 
  Navigation, 
  Award, 
  Filter,
  Activity,
  Loader2,
  Phone,
  CheckCircle2,
  Building2,
  ChevronDown,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/Navbar"
import { MedicalBackground } from "@/components/MedicalBackground"
import { toast } from "sonner"

const SPECIALTIES = [
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Pediatrician",
  "Orthopedic",
  "General Physician",
  "Gynecologist",
  "ENT Specialist",
  "Dentist",
  "Ophthalmologist",
  "Psychiatrist",
  "Urologist",
  "Gastroenterologist",
  "Oncologist"
];

export default function FindDoctorsPage() {
  const [searchSpecialty, setSearchSpecialty] = useState("")
  const [searchCity, setSearchCity] = useState("")
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<"all" | "registered" | "nearby">("all")
  
  // Dropdown states
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    if (userData.city) {
      setSearchCity(userData.city)
      fetchDoctors(userData.city, "")
    } else {
      fetchDoctors("Mumbai", "") 
    }
  }, [])

  const fetchDoctors = async (city: string, specialty: string) => {
    setLoading(true)
    try {
      const res = await fetch("/api/doctors", {
        method: "POST",
        body: JSON.stringify({ city, specialty }),
      })
      const data = await res.json()
      setDoctors(data.doctors || [])
    } catch (err) {
      toast.error("Failed to load specialists")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setShowDropdown(false)
    fetchDoctors(searchCity, searchSpecialty)
  }

  const filteredSpecialties = SPECIALTIES.filter(s => 
    s.toLowerCase().includes(searchSpecialty.toLowerCase())
  )

  const filteredDoctors = doctors.filter(doc => {
    if (filter === "registered") return doc.isRegistered
    if (filter === "nearby") return !doc.isRegistered
    return true
  })

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <MedicalBackground />
      <Navbar />

      <main className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-6xl mx-auto mb-16 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground">
              Find the Right <span className="text-primary">Specialist</span>
            </h1>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
              Discover top-rated doctors and verified clinics near you. Book instant consultations.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 p-4 bg-card/50 backdrop-blur-3xl border border-border rounded-[2.5rem] shadow-2xl max-w-4xl mx-auto relative"
          >
            {/* Searchable Specialty Dropdown */}
            <div className="flex-1 relative group" ref={dropdownRef}>
              <Stethoscope className="absolute left-6 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform z-10" size={20} />
              <Input 
                placeholder="Search Specialty..." 
                value={searchSpecialty}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setSearchSpecialty(e.target.value)
                  setShowDropdown(true)
                }}
                className="h-16 pl-14 pr-12 bg-secondary/30 border-0 rounded-2xl font-black text-lg focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {searchSpecialty && (
                   <X 
                    size={16} 
                    className="text-muted-foreground hover:text-primary cursor-pointer" 
                    onClick={() => setSearchSpecialty("")}
                  />
                )}
                <ChevronDown size={20} className={`text-muted-foreground transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-full mt-3 bg-card/95 backdrop-blur-2xl border border-border rounded-3xl shadow-3xl overflow-hidden z-50 max-h-80 overflow-y-auto custom-scrollbar"
                  >
                    <div className="p-2">
                      {filteredSpecialties.length > 0 ? (
                        filteredSpecialties.map((s) => (
                          <div
                            key={s}
                            onClick={() => {
                              setSearchSpecialty(s)
                              setShowDropdown(false)
                            }}
                            className="flex items-center gap-3 px-5 py-3.5 hover:bg-primary/10 rounded-2xl cursor-pointer transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/20 transition-all">
                              <Activity size={14} />
                            </div>
                            <span className="font-bold text-foreground">{s}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-6 text-center text-muted-foreground font-medium italic">
                          No specialties found
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 relative group">
              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-primary group-focus-within:scale-110 transition-transform" size={20} />
              <Input 
                placeholder="City (e.g. Mumbai)" 
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="h-16 pl-14 pr-6 bg-secondary/30 border-0 rounded-2xl font-black text-lg focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
              />
            </div>
            <Button type="submit" className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg gap-2 shadow-xl shadow-primary/20">
              <Search size={24} />
              Search
            </Button>
          </motion.form>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: "all", label: "All Providers", icon: Activity },
              { id: "registered", label: "One-Tap Verified", icon: ShieldCheck },
              { id: "nearby", label: "Nearby Clinics", icon: Building2 },
            ].map((f) => (
              <Button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                variant={filter === f.id ? "default" : "outline"}
                className={`h-10 px-6 rounded-full font-black text-[10px] uppercase tracking-widest gap-2 transition-all ${
                  filter === f.id ? "shadow-lg shadow-primary/20" : "bg-card/50"
                }`}
              >
                <f.icon size={14} />
                {f.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-[2.5rem] bg-secondary/20 animate-pulse border border-border" />
              ))
            ) : filteredDoctors.length > 0 ? (
              filteredDoctors.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className={`p-6 bg-card border-border hover:border-primary/40 transition-all duration-500 rounded-[2.5rem] shadow-xl group hover:shadow-primary/5 h-full flex flex-col justify-between relative overflow-hidden ${doc.isRegistered ? 'ring-2 ring-primary/20' : ''}`}>
                    {doc.isRegistered && (
                      <div className="absolute top-0 right-0 px-6 py-2 bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-bl-3xl flex items-center gap-1.5 shadow-xl">
                        <CheckCircle2 size={12} />
                        Priority Verified
                      </div>
                    )}

                    <div className="space-y-6">
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-secondary shadow-inner">
                            <img src={doc.image} alt={doc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 px-2 py-1 rounded-lg bg-background shadow-md border border-border flex items-center gap-1">
                            <Star size={10} fill="currentColor" className="text-yellow-500" />
                            <span className="text-[10px] font-black">{doc.rating}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors line-clamp-1">{doc.name}</h3>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{doc.specialty}</p>
                          <div className="flex items-center gap-1.5 text-primary">
                            <Award size={14} />
                            <span className="text-[11px] font-bold">{doc.experience}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-2 text-xs font-medium text-muted-foreground bg-secondary/30 p-4 rounded-2xl border border-border/50">
                          <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-bold text-foreground leading-tight">{doc.location}</p>
                            <p className="text-[10px] font-black text-primary uppercase tracking-tighter">{doc.distance}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {doc.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-[9px] font-black uppercase bg-primary/5 text-primary border-primary/10">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-12 w-12 rounded-2xl border border-border hover:bg-secondary transition-all"
                        asChild
                      >
                         <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(doc.location)}`} target="_blank" rel="noopener noreferrer">
                          <Navigation size={20} className="text-primary" />
                        </a>
                      </Button>
                      <Button className="flex-1 h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xs gap-2 shadow-lg shadow-primary/20">
                        {doc.isRegistered ? "Book Appointment" : "Consult Now"}
                        <ChevronRight size={14} />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-24 text-center space-y-6 bg-card/30 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-border">
                <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mx-auto text-muted-foreground">
                  <Search size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-foreground">No specialists match your search</h3>
                  <p className="text-muted-foreground font-medium max-w-md mx-auto">Try broadening your specialty or searching in a different city.</p>
                </div>
                <Button onClick={() => { setSearchSpecialty(""); fetchDoctors(searchCity, ""); }} variant="outline" className="h-12 px-8 rounded-xl font-black">
                  Reset Filters
                </Button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
