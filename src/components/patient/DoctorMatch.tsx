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
  Phone,
  LocateFixed,
  Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { BookingModal } from "@/components/appointments/BookingModal"

interface Props {
  specialty: string
  onBack: () => void
  initialDiagnosis?: any
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

export function DoctorMatch({ specialty, onBack, initialDiagnosis }: Props) {
  const [registeredDoctors, setRegisteredDoctors] = useState<Doctor[]>([])
  const [osmDoctors, setOsmDoctors] = useState<Doctor[]>([])
  const [loadingReg, setLoadingReg] = useState(false)
  const [loadingOsm, setLoadingOsm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [locationPermission, setLocationPermission] = useState<"prompt" | "granted" | "denied">("prompt")
  const [userCity, setUserCity] = useState<string>("")
  const [cityInput, setCityInput] = useState("")
  const [isLocationRequired, setIsLocationRequired] = useState(true)

  // Booking Modal states
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    if (userData.city) {
      setUserCity(userData.city)
      setIsLocationRequired(false)
      fetchDoctors({ city: userData.city })
    }
  }, [specialty])

  const fetchDoctors = async (params: { lat?: number; lng?: number; city?: string }) => {
    setLoadingReg(true)
    setLoadingOsm(true)
    setError(null)
    setRegisteredDoctors([])
    setOsmDoctors([])
    
    // 1. Fetch Registered Doctors FIRST (Fast)
    const fetchRegistered = async () => {
      try {
        const res = await fetch("/api/doctors/registered", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ specialty, city: params.city }),
        });
        const data = res.ok ? await res.json() : { doctors: [] };
        setRegisteredDoctors(data.doctors || []);
        if (data.doctors?.length > 0) setIsLocationRequired(false);
      } catch (err) {
        console.error("Reg API Error:", err);
      } finally {
        setLoadingReg(false);
      }
    };

    // 2. Fetch OSM Doctors SECOND (Slower)
    const fetchOSM = async () => {
      try {
        const res = await fetch("/api/doctors/osm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            specialty,
            lat: params.lat,
            lng: params.lng,
            city: params.city
          }),
        });
        const data = res.ok ? await res.json() : { doctors: [] };
        setOsmDoctors(data.doctors || []);
        if (data.doctors?.length > 0) setIsLocationRequired(false);
      } catch (err) {
        console.error("OSM API Error:", err);
      } finally {
        setLoadingOsm(false);
      }
    };

    // Trigger both but they update independently
    fetchRegistered();
    fetchOSM();
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser")
      return
    }

    setLoadingReg(true)
    setLoadingOsm(true)
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
        setLoadingReg(false)
        setLoadingOsm(false)
        toast.error("Location access denied. Please enter city manually.")
      }
    )
  }

  const handleManualCitySubmit = async () => {
    if (!cityInput.trim()) return;
    
    setLoadingReg(true)
    setLoadingOsm(true)
    try {
      // Save city to profile
      const res = await fetch("/api/user/details", {
        method: "POST",
        body: JSON.stringify({ city: cityInput }),
      })

      if (res.ok) {
        const userData = JSON.parse(localStorage.getItem("user") || "{}")
        userData.city = cityInput
        localStorage.setItem("user", JSON.stringify(userData))
        setUserCity(cityInput)
        fetchDoctors({ city: cityInput })
      }
    } catch (err) {
      toast.error("Failed to save location")
    } finally {
      setLoadingReg(false)
      setLoadingOsm(false)
    }
  }

  if (isLocationRequired && !loadingReg && !loadingOsm) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary">
            <LocateFixed size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight">Location Required</h2>
            <p className="text-muted-foreground font-medium">
              To find the best specialists for your <span className="text-foreground font-bold">{specialty}</span> concern, we need to know your area.
            </p>
          </div>

          <Card className="p-8 bg-card/50 border-border backdrop-blur-xl rounded-[2rem] space-y-6">
            <Button 
              onClick={handleGetLocation}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black gap-3 shadow-lg shadow-primary/20"
            >
              <Navigation size={20} />
              Use Current Location
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground font-bold">Or enter manually</span></div>
            </div>

            <div className="flex gap-3">
              <div className="relative flex-1 group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <Input 
                  placeholder="Enter your city..." 
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  className="h-14 pl-12 rounded-2xl bg-secondary/50 border-border font-bold"
                />
              </div>
              <Button 
                onClick={handleManualCitySubmit}
                disabled={!cityInput}
                variant="secondary" 
                className="h-14 px-6 rounded-2xl font-black"
              >
                Search
              </Button>
            </div>
          </Card>

          <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-primary gap-2 font-bold">
            <ArrowLeft size={16} />
            Back to Diagnosis
          </Button>
        </motion.div>
      </div>
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
              {(loadingReg || loadingOsm) && <Loader2 size={24} className="animate-spin text-primary mt-2" />}
            </div>
            <p className="text-muted-foreground font-medium text-lg">
              Verified <span className="text-foreground font-black underline decoration-primary/30 decoration-4">{specialty}</span> specialists in <span className="text-primary font-black uppercase">{userCity || "Your Area"}</span>.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} />
            Verified Providers
          </div>
          <Button 
            onClick={() => setIsLocationRequired(true)}
            variant="outline" 
            size="sm" 
            className="rounded-full gap-2 text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5"
          >
            <MapPin size={12} />
            Change Location
          </Button>
        </div>
      </div>

      <div className="space-y-12">
        {/* Section 1: Platform Partners */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck size={18} />
            </div>
            <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Verified Platform Partners</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loadingReg ? (
              [1, 2].map((i) => (
                <div key={i} className="h-64 rounded-[2rem] bg-secondary/20 animate-pulse border border-border" />
              ))
            ) : registeredDoctors.length > 0 ? (
              registeredDoctors.map((doctor, i) => (
                <DoctorCard 
                  key={doctor.id} 
                  doctor={doctor} 
                  index={i} 
                  onBook={(doc) => {
                    setSelectedDoctor(doc)
                    setIsBookingModalOpen(true)
                  }} 
                />
              ))
            ) : !loadingReg && (
              <div className="col-span-full p-8 text-center bg-secondary/5 rounded-2xl border border-dashed border-border text-muted-foreground text-sm font-bold italic">
                No registered partners found in this area.
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Local Clinics via OSM */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Building2 size={18} />
              </div>
              <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Nearby Local Clinics</h3>
            </div>
            {loadingOsm && (
              <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest animate-pulse">
                <Loader2 size={12} className="animate-spin" />
                Scanning Area...
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loadingOsm && osmDoctors.length === 0 ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 rounded-[2rem] bg-secondary/20 animate-pulse border border-border" />
              ))
            ) : osmDoctors.length > 0 ? (
              osmDoctors.map((doctor, i) => (
                <DoctorCard 
                  key={doctor.id} 
                  doctor={doctor} 
                  index={i} 
                  onBook={(doc) => {
                    setSelectedDoctor(doc)
                    setIsBookingModalOpen(true)
                  }} 
                />
              ))
            ) : !loadingOsm && (
              <div className="col-span-full py-20 text-center space-y-4 bg-secondary/10 rounded-[3rem] border-2 border-dashed border-border">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                  <Search size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-foreground">No local clinics found</h3>
                  <p className="text-muted-foreground font-medium">Try broadening your search or enabling location access.</p>
                </div>
                <Button onClick={() => fetchDoctors({ city: userCity })} variant="outline" className="rounded-xl font-black">
                  Retry Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedDoctor && (
        <BookingModal 
          isOpen={isBookingModalOpen} 
          onClose={() => setIsBookingModalOpen(false)} 
          doctor={{
            id: selectedDoctor.id,
            name: selectedDoctor.name,
            specialty: selectedDoctor.specialty,
            image: selectedDoctor.image
          }}
          initialDiagnosis={initialDiagnosis}
        />
      )}
    </div>
  )
}

function DoctorCard({ doctor, index, onBook }: { doctor: Doctor, index: number, onBook: (doc: Doctor) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
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
              {doctor.tags.map((tag, idx) => (
                <span key={`${tag}-${idx}`} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-start gap-2 text-[11px] font-bold text-muted-foreground leading-snug">
                <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                {doctor.location}
              </div>
              {doctor.experience && (
                <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground">
                  <Award size={14} className="text-primary" />
                  {doctor.experience}
                </div>
              )}
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
            <Button 
              onClick={() => onBook(doctor)}
              className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-xs shadow-lg shadow-primary/20 gap-2"
            >
              Book Now
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
