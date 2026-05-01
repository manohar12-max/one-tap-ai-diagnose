"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Activity, 
  Stethoscope, 
  Briefcase, 
  FileCheck, 
  UserCircle, 
  Save, 
  Loader2, 
  FlaskConical, 
  Pill, 
  ShieldAlert, 
  MapPin, 
  IndianRupee,
  GraduationCap,
  History
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/Navbar"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

const COMMON_ALLERGIES = ["Penicillin", "Peanuts", "Dust", "Latex", "Sulfa", "Shellfish", "Aspirin"];
const CHRONIC_CONDITIONS = ["Diabetes", "Hypertension", "Asthma", "Thyroid", "Cholesterol", "PCOS"];

export default function OnboardingPage() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState<any>({
    // Shared
    age: "",
    gender: "",
    city: "",
    
    // Doctor specific
    specialty: "",
    licenseNumber: "",
    experience: "",
    degree: "",
    clinicName: "",
    clinicAddress: "",
    consultationFee: "",
    bio: "",

    // Patient specific
    bloodGroup: "",
    height: "",
    weight: "",
    medicalHistory: "",
    allergies: [] as string[],
    chronicConditions: [] as string[],
    currentMedications: "",
    emergencyContact: "",
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}")
      if (userData.id) {
        setUser(userData)
      }
    }
    checkUser()
  }, [])

  const toggleChip = (field: "allergies" | "chronicConditions", value: string) => {
    setFormData((prev: any) => {
      const current = prev[field] as string[];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/user/details", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Profile fully synced!", {
          description: "Your health vault is now ready.",
        })
        
        // Update local user state
        const updatedUser = { ...user, isDetailsFilled: true };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        router.push("/dashboard")
      } else {
        const errorMessage = data.error || "Update failed"
        setError(errorMessage)
        toast.error("Sync Error", {
          description: errorMessage,
        })
      }
    } catch (err) {
      setError("An unexpected error occurred")
      toast.error("System Error", {
        description: "Failed to save profile. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const role = user?.role || "PATIENT"

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden transition-colors duration-300">
      <Navbar />
      
      <div className="flex items-center justify-center p-6 py-20 min-h-[calc(100vh-64px)]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#3b82f6,transparent)] opacity-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl relative z-10"
        >
          <Card className="p-8 md:p-12 bg-card/60 border-border backdrop-blur-3xl shadow-3xl rounded-[3rem]">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
                {role === 'DOCTOR' ? <Stethoscope size={40} /> : <Activity size={40} />}
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-foreground tracking-tight uppercase">
                  {role === 'DOCTOR' ? 'Clinical Profile' : 'Health Vault'}
                </h1>
                <p className="text-muted-foreground text-lg max-w-md">
                  {role === 'DOCTOR' 
                    ? 'Verify your professional credentials to start consulting.' 
                    : 'Your personal medical history helps our AI provide accurate triage.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info for both */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Current Age</label>
                  <Input
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="bg-secondary/30 border-border h-14 px-6 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 font-bold"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Gender Identity</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-secondary/30 border border-border h-14 px-6 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 outline-none appearance-none font-bold"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Current City</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                    <Input
                      placeholder="e.g. Mumbai, Delhi, New York"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="bg-secondary/30 border-border h-14 pl-12 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 font-bold"
                      required
                    />
                  </div>
                </div>

                {role === "DOCTOR" ? (
                  <>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Medical Degree & Qualifications</label>
                      <div className="relative group">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                          placeholder="e.g. MBBS, MD (Cardiology)"
                          value={formData.degree}
                          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                          className="bg-secondary/30 border-border h-14 pl-12 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 font-bold"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Specialization</label>
                      <Input
                        placeholder="e.g. Cardiologist"
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        className="bg-secondary/30 border-border h-14 px-6 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">License No.</label>
                      <Input
                        placeholder="MC-123456"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        className="bg-secondary/30 border-border h-14 px-6 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Clinic Name</label>
                      <Input
                        placeholder="City Care Hospital"
                        value={formData.clinicName}
                        onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                        className="bg-secondary/30 border-border h-14 px-6 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 font-bold"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Consultation Fee</label>
                      <div className="relative group">
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                          type="number"
                          placeholder="500"
                          value={formData.consultationFee}
                          onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                          className="bg-secondary/30 border-border h-14 pl-12 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 font-bold"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Clinic Address</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                          placeholder="Full clinical address..."
                          value={formData.clinicAddress}
                          onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                          className="bg-secondary/30 border-border h-14 pl-12 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 font-bold"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Professional Bio</label>
                      <textarea
                        placeholder="Briefly describe your expertise..."
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full bg-secondary/30 border border-border min-h-[100px] p-6 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 outline-none resize-none font-medium"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Blood Group</label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full bg-secondary/30 border border-border h-14 px-6 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 outline-none appearance-none font-bold"
                      >
                        <option value="">Select</option>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Height (cm)</label>
                        <Input
                          type="number"
                          placeholder="170"
                          value={formData.height}
                          onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                          className="bg-secondary/30 border-border h-14 px-6 rounded-2xl text-foreground font-bold"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Weight (kg)</label>
                        <Input
                          type="number"
                          placeholder="70"
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                          className="bg-secondary/30 border-border h-14 px-6 rounded-2xl text-foreground font-bold"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        <ShieldAlert size={14} className="text-red-500" />
                        Allergies
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {COMMON_ALLERGIES.map(allergy => (
                          <Badge
                            key={allergy}
                            variant={formData.allergies.includes(allergy) ? "default" : "outline"}
                            className="cursor-pointer py-1.5 px-4 rounded-xl font-bold transition-all"
                            onClick={() => toggleChip("allergies", allergy)}
                          >
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                        <History size={14} className="text-blue-500" />
                        Chronic Conditions
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {CHRONIC_CONDITIONS.map(condition => (
                          <Badge
                            key={condition}
                            variant={formData.chronicConditions.includes(condition) ? "default" : "outline"}
                            className="cursor-pointer py-1.5 px-4 rounded-xl font-bold transition-all"
                            onClick={() => toggleChip("chronicConditions", condition)}
                          >
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-3">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Current Medications</label>
                      <div className="relative group">
                        <Pill className="absolute left-4 top-4 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                        <textarea
                          placeholder="List any medicine you take regularly..."
                          value={formData.currentMedications}
                          onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                          className="w-full bg-secondary/30 border border-border min-h-[80px] pl-12 pr-6 py-4 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 outline-none resize-none font-medium"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-lg tracking-widest uppercase shadow-2xl shadow-primary/30 transition-all hover:scale-[1.01] active:scale-[0.99] gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    <Save size={24} />
                    Complete Setup
                  </>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
