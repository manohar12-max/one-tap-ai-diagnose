"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Activity, 
  Stethoscope, 
  Save, 
  Loader2, 
  FlaskConical, 
  Pill, 
  ShieldAlert, 
  MapPin, 
  IndianRupee,
  GraduationCap,
  History,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/Navbar"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

const COMMON_ALLERGIES = ["Penicillin", "Peanuts", "Dust", "Latex", "Sulfa", "Shellfish", "Aspirin"];
const CHRONIC_CONDITIONS = ["Diabetes", "Hypertension", "Asthma", "Thyroid", "Cholesterol", "PCOS"];

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState<any>({
    age: "",
    gender: "",
    city: "",
    specialty: "",
    licenseNumber: "",
    experience: "",
    degree: "",
    clinicName: "",
    clinicAddress: "",
    consultationFee: "",
    bio: "",
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
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [customAllergy, setCustomAllergy] = useState("")
  const [customCondition, setCustomCondition] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch("/api/user/details")
        if (res.ok) {
          const data = await res.json()
          setUser(data)
          setFormData({
            age: data.age || "",
            gender: data.gender || "",
            city: data.city || "",
            specialty: data.specialty || "",
            licenseNumber: data.licenseNumber || "",
            experience: data.experience || "",
            degree: data.degree || "",
            clinicName: data.clinicName || "",
            clinicAddress: data.clinicAddress || "",
            consultationFee: data.consultationFee || "",
            bio: data.bio || "",
            bloodGroup: data.bloodGroup || "",
            height: data.height || "",
            weight: data.weight || "",
            medicalHistory: data.medicalHistory || "",
            allergies: data.allergies || [],
            chronicConditions: data.chronicConditions || [],
            currentMedications: data.currentMedications || "",
            emergencyContact: data.emergencyContact || "",
          })
        } else {
          toast.error("Failed to load profile details")
        }
      } catch (err) {
        console.error("Error fetching user details:", err)
      } finally {
        setFetching(false)
      }
    }
    fetchUserDetails()
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

  const addCustomItem = (field: "allergies" | "chronicConditions", value: string) => {
    if (!value.trim()) return;
    setFormData((prev: any) => {
      const current = prev[field] as string[];
      if (!current.includes(value.trim())) {
        return { ...prev, [field]: [...current, value.trim()] };
      }
      return prev;
    });
    if (field === "allergies") setCustomAllergy("");
    else setCustomCondition("");
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

      if (res.ok) {
        toast.success("Profile Updated!", {
          description: "Proceeding to your dashboard.",
        })
        router.push("/dashboard")
      } else {
        const data = await res.json()
        setError(data.error || "Update failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    )
  }

  const role = user?.role || "PATIENT"

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden transition-colors duration-300">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-8 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto mb-6">
           <Button 
            variant="ghost" 
            onClick={() => router.push("/dashboard")}
            className="text-muted-foreground hover:text-primary -ml-4 gap-2 font-bold"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-4xl mx-auto relative z-10"
        >
          <Card className="p-8 md:p-12 bg-card/60 border-border backdrop-blur-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] rounded-[3rem]">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-12 border-b border-border/50 pb-8">
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <CheckCircle2 size={12} />
                  Mandatory Identity Sync
                </div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase">
                   Review Your <span className="text-primary italic">Profile</span>
                </h1>
                <p className="text-muted-foreground text-base max-w-md font-medium">
                   Verify your clinical data before entering the dashboard. This ensures AI diagnosis accuracy.
                </p>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary/20 to-indigo-500/20 flex items-center justify-center text-primary shadow-inner border border-white/10">
                   {role === 'DOCTOR' ? <Stethoscope size={48} /> : <Activity size={48} />}
                </div>
                <Badge variant="secondary" className="font-black tracking-widest uppercase text-[10px] px-3">{role}</Badge>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                
                {/* Basic Section */}
                <div className="space-y-8">
                   <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                     <ArrowRight size={14} />
                     Core Identity
                   </h3>
                   
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Current Age</label>
                        <Input
                          type="number"
                          placeholder="25"
                          min="0"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: Math.max(0, parseInt(e.target.value) || 0).toString() })}
                          className="bg-secondary/40 border-border h-14 px-6 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 font-bold"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Gender</label>
                        <select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="w-full bg-secondary/40 border border-border h-14 px-6 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 outline-none appearance-none font-bold"
                          required
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                   </div>

                   <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Current City</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                      <Input
                        placeholder="e.g. Mumbai, Delhi"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="bg-secondary/40 border-border h-14 pl-12 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 font-bold"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Role Specific Section */}
                <div className="space-y-8">
                   <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                     <ArrowRight size={14} />
                     {role === 'DOCTOR' ? 'Clinical Credentials' : 'Physical Vitals'}
                   </h3>

                   {role === "DOCTOR" ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Degree</label>
                          <Input
                            placeholder="e.g. MBBS, MD"
                            value={formData.degree}
                            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                            className="bg-secondary/40 border-border h-14 px-6 rounded-2xl text-foreground font-bold"
                            required
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Experience (Years)</label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="10"
                            value={formData.experience}
                            onChange={(e) => setFormData({ ...formData, experience: Math.max(0, parseInt(e.target.value) || 0).toString() })}
                            className="bg-secondary/40 border-border h-14 px-6 rounded-2xl text-foreground font-bold"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Specialization</label>
                          <Input
                            placeholder="e.g. Cardiologist"
                            value={formData.specialty}
                            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                            className="bg-secondary/40 border-border h-14 px-6 rounded-2xl text-foreground font-bold"
                            required
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">License No.</label>
                          <Input
                            placeholder="MC-123456"
                            value={formData.licenseNumber}
                            onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                            className="bg-secondary/40 border-border h-14 px-6 rounded-2xl text-foreground font-bold"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Clinic Name</label>
                          <Input
                            placeholder="City Care"
                            value={formData.clinicName}
                            onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                            className="bg-secondary/40 border-border h-14 px-6 rounded-2xl text-foreground font-bold"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Consultation Fee</label>
                          <div className="relative group">
                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <Input
                              type="number"
                              min="0"
                              placeholder="500"
                              value={formData.consultationFee}
                              onChange={(e) => setFormData({ ...formData, consultationFee: Math.max(0, parseInt(e.target.value) || 0).toString() })}
                              className="bg-secondary/40 border-border h-14 pl-10 pr-6 rounded-2xl text-foreground font-bold"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Clinic Address</label>
                        <Input
                          placeholder="Full address..."
                          value={formData.clinicAddress}
                          onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                          className="bg-secondary/40 border-border h-14 px-6 rounded-2xl text-foreground font-bold"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                       <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Height (cm)</label>
                          <Input
                            type="number"
                            placeholder="170"
                            min="0"
                            value={formData.height}
                            onChange={(e) => setFormData({ ...formData, height: Math.max(0, parseInt(e.target.value) || 0).toString() })}
                            className="bg-secondary/40 border-border h-14 px-6 rounded-2xl text-foreground font-bold"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Weight (kg)</label>
                          <Input
                            type="number"
                            placeholder="70"
                            min="0"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: Math.max(0, parseInt(e.target.value) || 0).toString() })}
                            className="bg-secondary/40 border-border h-14 px-6 rounded-2xl text-foreground font-bold"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Blood Group</label>
                        <select
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                          className="w-full bg-secondary/40 border border-border h-14 px-6 rounded-2xl text-foreground font-bold outline-none"
                        >
                          <option value="">Select</option>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Medical Context (Full Width) */}
                <div className="md:col-span-2 space-y-10 pt-4">
                  <h3 className="text-xs font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                     <ArrowRight size={14} />
                     Medical Context & Allergies
                  </h3>

                  {role === 'PATIENT' && (
                    <>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                          <ShieldAlert size={14} className="text-red-500" />
                          Known Allergies
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {COMMON_ALLERGIES.map(allergy => (
                            <Badge
                              key={allergy}
                              variant={formData.allergies.includes(allergy) ? "default" : "outline"}
                              className={`cursor-pointer py-2 px-5 rounded-xl font-bold transition-all ${formData.allergies.includes(allergy) ? 'bg-primary shadow-lg shadow-primary/20' : 'hover:bg-primary/5 border-border'}`}
                              onClick={() => toggleChip("allergies", allergy)}
                            >
                              {allergy}
                            </Badge>
                          ))}
                          {formData.allergies.filter((a: string) => !COMMON_ALLERGIES.includes(a)).map((allergy: string) => (
                            <Badge
                              key={allergy}
                              variant="default"
                              className="cursor-pointer py-2 px-5 rounded-xl font-bold transition-all bg-indigo-600 shadow-lg shadow-indigo-600/20"
                              onClick={() => toggleChip("allergies", allergy)}
                            >
                              {allergy} ×
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Input 
                            placeholder="Add other allergy..." 
                            value={customAllergy}
                            onChange={(e) => setCustomAllergy(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem("allergies", customAllergy))}
                            className="bg-secondary/40 border-border h-12 rounded-xl text-sm"
                          />
                          <Button 
                            type="button" 
                            variant="secondary" 
                            className="h-12 px-6 rounded-xl font-bold"
                            onClick={() => addCustomItem("allergies", customAllergy)}
                          >
                            Add
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                          <History size={14} className="text-blue-500" />
                          Chronic Conditions
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {CHRONIC_CONDITIONS.map(condition => (
                            <Badge
                              key={condition}
                              variant={formData.chronicConditions.includes(condition) ? "default" : "outline"}
                              className={`cursor-pointer py-2 px-5 rounded-xl font-bold transition-all ${formData.chronicConditions.includes(condition) ? 'bg-primary shadow-lg shadow-primary/20' : 'hover:bg-primary/5 border-border'}`}
                              onClick={() => toggleChip("chronicConditions", condition)}
                            >
                              {condition}
                            </Badge>
                          ))}
                          {formData.chronicConditions.filter((c: string) => !CHRONIC_CONDITIONS.includes(c)).map((condition: string) => (
                            <Badge
                              key={condition}
                              variant="default"
                              className="cursor-pointer py-2 px-5 rounded-xl font-bold transition-all bg-indigo-600 shadow-lg shadow-indigo-600/20"
                              onClick={() => toggleChip("chronicConditions", condition)}
                            >
                              {condition} ×
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Input 
                            placeholder="Add other condition..." 
                            value={customCondition}
                            onChange={(e) => setCustomCondition(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomItem("chronicConditions", customCondition))}
                            className="bg-secondary/40 border-border h-12 rounded-xl text-sm"
                          />
                          <Button 
                            type="button" 
                            variant="secondary" 
                            className="h-12 px-6 rounded-xl font-bold"
                            onClick={() => addCustomItem("chronicConditions", customCondition)}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">
                       {role === 'DOCTOR' ? 'Professional Bio' : 'General Medical History'}
                    </label>
                    <textarea
                      placeholder={role === 'DOCTOR' ? 'Describe your expertise...' : 'Previous surgeries, major illnesses, etc.'}
                      value={role === 'DOCTOR' ? formData.bio : formData.medicalHistory}
                      onChange={(e) => setFormData({ ...formData, [role === 'DOCTOR' ? 'bio' : 'medicalHistory']: e.target.value })}
                      className="w-full bg-secondary/40 border border-border min-h-[120px] p-6 rounded-[2rem] text-foreground focus:ring-4 focus:ring-primary/10 outline-none resize-none font-medium text-sm leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center animate-shake">
                  {error}
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] h-20 bg-primary hover:bg-primary/90 text-white rounded-[2rem] font-black text-xl tracking-[0.1em] uppercase shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] gap-4"
                >
                  {loading ? <Loader2 className="animate-spin" size={28} /> : (
                    <>
                      <Save size={28} />
                      Verify & Continue
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                  className="flex-1 h-20 border-border bg-card/40 hover:bg-secondary/60 text-muted-foreground rounded-[2rem] font-black text-sm tracking-[0.2em] uppercase transition-all"
                >
                   Skip to Dashboard
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
