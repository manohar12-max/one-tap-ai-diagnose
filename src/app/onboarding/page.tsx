"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Activity, Stethoscope, Briefcase, FileCheck, UserCircle, Save, Loader2, FlaskConical, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/Navbar"
import { toast } from "sonner"

export default function OnboardingPage() {
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState<any>({
    specialty: "",
    licenseNumber: "",
    experience: "",
    age: "",
    gender: "",
    medicalHistory: "",
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
        toast.success("Profile completed!", {
          description: "Your professional details have been verified.",
        })
        router.push("/")
      } else {
        const errorMessage = data.error || "Update failed"
        setError(errorMessage)
        toast.error("Profile Error", {
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
      
      <div className="flex items-center justify-center p-6 min-h-[calc(100vh-64px)]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1e293b,transparent)] opacity-20" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl relative z-10"
        >
          <Card className="p-10 bg-card/50 border-border backdrop-blur-2xl shadow-3xl rounded-[2.5rem]">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                {role === 'DOCTOR' ? <Stethoscope size={40} /> : <UserCircle size={40} />}
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-foreground tracking-tight">Complete Profile</h1>
                <p className="text-muted-foreground text-lg">
                  {role === 'DOCTOR' ? 'Doctor verification details required' : 'Tell us a bit more about yourself (Optional)'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {role === "DOCTOR" ? (
                  <>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Specialization</label>
                      <div className="relative group">
                        <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                          placeholder="e.g. Cardiologist"
                          value={formData.specialty}
                          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                          className="bg-secondary/50 border-border h-14 pl-12 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">License Number</label>
                      <div className="relative group">
                        <FileCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                          placeholder="MC-123456"
                          value={formData.licenseNumber}
                          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                          className="bg-secondary/50 border-border h-14 pl-12 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10"
                          required
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Years of Experience</label>
                      <div className="relative group">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                        <Input
                          type="number"
                          placeholder="10"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="bg-secondary/50 border-border h-14 pl-12 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10"
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Age</label>
                      <Input
                        type="number"
                        placeholder="25"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="bg-secondary/50 border-border h-14 px-6 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full bg-secondary/50 border border-border h-14 px-6 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 outline-none appearance-none"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Medical History</label>
                      <textarea
                        placeholder="List any chronic conditions or allergies..."
                        value={formData.medicalHistory}
                        onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                        className="w-full bg-secondary/50 border border-border min-h-[120px] p-6 rounded-2xl text-foreground focus:ring-4 focus:ring-primary/10 outline-none resize-none"
                      />
                    </div>
                  </>
                )}
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-[1.25rem] font-black text-lg tracking-widest uppercase shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : (
                  <>
                    <Save size={24} />
                    Save & Continue
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
