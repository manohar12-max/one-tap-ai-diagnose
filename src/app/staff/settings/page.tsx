"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Stethoscope, 
  Save, 
  Loader2, 
  MapPin, 
  IndianRupee,
  GraduationCap,
  Briefcase,
  User,
  ShieldCheck,
  FileText,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const SPECIALTIES = [
  "Cardiologist", "Dermatologist", "Neurologist", "Pediatrician", "Orthopedic",
  "General Physician", "Gynecologist", "ENT Specialist", "Dentist", "Ophthalmologist",
  "Psychiatrist", "Urologist", "Gastroenterologist", "Oncologist"
];

export default function StaffSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState<any>({
    specialty: "",
    licenseNumber: "",
    experience: "",
    degree: "",
    clinicName: "",
    clinicAddress: "",
    consultationFee: "",
    bio: "",
    availability: ""
  })
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch("/api/user/details")
        const data = await res.json()
        if (res.ok) {
          setFormData({
            specialty: data.specialty || "",
            licenseNumber: data.licenseNumber || "",
            experience: data.experience || "",
            degree: data.degree || "",
            clinicName: data.clinicName || "",
            clinicAddress: data.clinicAddress || "",
            consultationFee: data.consultationFee || "",
            bio: data.bio || "",
            availability: data.availability || ""
          })
          setSearchTerm(data.specialty || "")
        }
      } catch (err) {
        console.error("Failed to fetch details", err)
      } finally {
        setFetching(false)
      }
    }
    fetchDetails()
  }, [])

  const filteredSpecialties = SPECIALTIES.filter(s =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/user/details", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success("Professional Profile Updated", {
          description: "Your clinical credentials have been synced.",
        })
        
        const userData = JSON.parse(localStorage.getItem("user") || "{}")
        localStorage.setItem("user", JSON.stringify({ ...userData, isDetailsFilled: true }))

        setTimeout(() => {
          window.location.href = "/staff/dashboard"
        }, 1500)
      } else {
        toast.error("Update Failed", {
          description: "Could not save your professional details.",
        })
      }
    } catch (err) {
      toast.error("System Error", {
        description: "Please check your connection.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
          Clinical <span className="text-primary">Settings</span>
        </h1>
        <p className="text-muted-foreground font-bold tracking-wide uppercase text-xs">
          Manage your professional identity and consultation details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 bg-card/40 border-border backdrop-blur-xl rounded-[3rem] space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">Verified Credentials</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Specialty</label>
                <div className="relative group">
                  <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                  <Input
                    placeholder="Search or Select Specialty"
                    value={searchTerm}
                    onFocus={() => setShowDropdown(true)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchTerm(e.target.value)
                      setShowDropdown(true)
                    }}
                    className="bg-secondary/30 border-border h-12 pl-12 rounded-2xl text-foreground font-bold focus:ring-4 focus:ring-primary/10"
                    required
                  />
                  {showDropdown && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-2xl shadow-2xl z-[100] max-h-60 overflow-y-auto custom-scrollbar p-2">
                      {filteredSpecialties.length > 0 ? (
                        filteredSpecialties.map(s => (
                          <div
                            key={s}
                            onClick={() => {
                              setFormData({ ...formData, specialty: s })
                              setSearchTerm(s)
                              setShowDropdown(false)
                            }}
                            className="px-4 py-2 hover:bg-primary/10 rounded-xl cursor-pointer text-sm font-bold transition-colors"
                          >
                            {s}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-xs text-muted-foreground italic">No matches found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">License Number</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                  <Input
                    placeholder="e.g. MC-12345"
                    value={formData.licenseNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="bg-secondary/30 border-border h-12 pl-12 rounded-2xl text-foreground font-bold focus:ring-4 focus:ring-primary/10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Degree/Qualifications</label>
                <div className="relative group">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                  <Input
                    placeholder="e.g. MBBS, MD"
                    value={formData.degree}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, degree: e.target.value })}
                    className="bg-secondary/30 border-border h-12 pl-12 rounded-2xl text-foreground font-bold focus:ring-4 focus:ring-primary/10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Years of Experience</label>
                <div className="relative group">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                  <Input
                    type="number"
                    placeholder="e.g. 10"
                    value={formData.experience}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, experience: e.target.value })}
                    className="bg-secondary/30 border-border h-12 pl-12 rounded-2xl text-foreground font-bold focus:ring-4 focus:ring-primary/10"
                    required
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-card/40 border-border backdrop-blur-xl rounded-[3rem] space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <MapPin size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">Clinic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Clinic Name</label>
                <Input
                  placeholder="e.g. City Health Clinic"
                  value={formData.clinicName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, clinicName: e.target.value })}
                  className="bg-secondary/30 border-border h-12 px-6 rounded-2xl text-foreground font-bold focus:ring-4 focus:ring-primary/10"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Full Clinic Address</label>
                <textarea
                  placeholder="Street, Area, City, Zip"
                  value={formData.clinicAddress}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, clinicAddress: e.target.value })}
                  className="w-full bg-secondary/30 border border-border min-h-[100px] p-6 rounded-3xl text-foreground focus:ring-4 focus:ring-primary/10 outline-none resize-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Consultation Fee (₹)</label>
                <div className="relative group">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                  <Input
                    type="number"
                    placeholder="500"
                    value={formData.consultationFee}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, consultationFee: e.target.value })}
                    className="bg-secondary/30 border-border h-12 pl-12 rounded-2xl text-foreground font-bold focus:ring-4 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Availability</label>
                <Input
                  placeholder="e.g. Mon-Fri, 10AM-4PM"
                  value={formData.availability}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, availability: e.target.value })}
                  className="bg-secondary/30 border-border h-12 px-6 rounded-2xl text-foreground font-bold focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-8 bg-card/40 border-border backdrop-blur-xl rounded-[3rem] space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <FileText size={20} />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">Bio</h2>
            </div>
            <textarea
              placeholder="Tell patients about your expertise..."
              value={formData.bio}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-secondary/30 border border-border min-h-[250px] p-6 rounded-3xl text-foreground focus:ring-4 focus:ring-primary/10 outline-none resize-none font-medium"
            />
          </Card>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-black text-lg tracking-widest uppercase shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99] gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
              <>
                <Save size={24} />
                Save Profile
              </>
            )}
          </Button>

          <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50 space-y-2">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Profile Strength</p>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[85%]" />
            </div>
            <p className="text-[10px] font-bold text-primary uppercase">85% Complete</p>
          </div>
        </div>
      </form>
    </div>
  )
}
