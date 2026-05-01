"use client"

import { motion } from "framer-motion"
import { 
  Star, 
  MapPin, 
  Calendar, 
  ArrowLeft, 
  ChevronRight, 
  Award,
  Search,
  ShieldCheck,
  Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Props {
  specialty: string
  onBack: () => void
}

// Mock Doctors Data
const MOCK_DOCTORS = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "General Physician",
    rating: 4.9,
    reviews: 124,
    experience: "12 years",
    location: "Clinical Center, Downtown",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200",
    tags: ["Top Rated", "Available Today"]
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "General Physician",
    rating: 4.8,
    reviews: 89,
    experience: "15 years",
    location: "Health Hub, Westside",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200",
    tags: ["Experienced"]
  },
  {
    id: "3",
    name: "Dr. Elena Rodriguez",
    specialty: "Dermatologist",
    rating: 5.0,
    reviews: 215,
    experience: "10 years",
    location: "Skin Care Institute",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200&h=200",
    tags: ["Specialist", "Highly Recommended"]
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialty: "Cardiologist",
    rating: 4.9,
    reviews: 156,
    experience: "20 years",
    location: "Heart & Vascular Center",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200&h=200",
    tags: ["Senior Expert"]
  }
]

export function DoctorMatch({ specialty, onBack }: Props) {
  // Filter doctors based on specialty (case insensitive)
  const filteredDoctors = MOCK_DOCTORS.filter(d => 
    d.specialty.toLowerCase().includes(specialty.toLowerCase()) || 
    specialty.toLowerCase().includes(d.specialty.toLowerCase())
  ).length > 0 ? MOCK_DOCTORS.filter(d => 
    d.specialty.toLowerCase().includes(specialty.toLowerCase()) || 
    specialty.toLowerCase().includes(d.specialty.toLowerCase())
  ) : MOCK_DOCTORS.slice(0, 2); // Default to first 2 if no match

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
            <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
              Recommended <span className="text-primary">Specialists</span>
            </h2>
            <p className="text-muted-foreground font-medium text-lg">
              Based on your clinical assessment for <span className="text-foreground font-black underline decoration-primary/30 decoration-4">{specialty}</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
          <ShieldCheck size={14} />
          Verified Providers
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doctor, i) => (
          <motion.div
            key={doctor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 bg-card border-border hover:border-primary/30 transition-all duration-300 rounded-[2rem] shadow-xl group hover:shadow-primary/5">
              <div className="flex items-start gap-6">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg">
                    <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white dark:bg-slate-900 shadow-md flex items-center justify-center text-yellow-500 border border-border">
                    <Star size={16} fill="currentColor" />
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors">{doctor.name}</h3>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{doctor.specialty}</p>
                    </div>
                    <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-tighter">
                      {doctor.experience} Exp
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {doctor.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/5 text-primary border border-primary/10">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                      <MapPin size={12} className="text-primary" />
                      {doctor.location}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                      <Calendar size={12} className="text-primary" />
                      Next available: Today, 4:00 PM
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-foreground">{doctor.rating}</span>
                  <span className="text-[10px] font-bold text-muted-foreground">({doctor.reviews} reviews)</span>
                </div>
                <Button className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-black text-xs shadow-lg shadow-primary/20 gap-2">
                  Book Appointment
                  <ChevronRight size={14} />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <p className="text-sm font-bold text-muted-foreground">Don't see what you're looking for?</p>
        <Button variant="outline" className="rounded-2xl h-12 px-8 border-primary/20 text-primary font-black gap-2">
          <Search size={18} />
          Search More Specialists
        </Button>
      </div>
    </div>
  )
}
