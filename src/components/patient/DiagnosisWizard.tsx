"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Brain, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Upload, 
  Activity, 
  Stethoscope, 
  AlertCircle,
  Clock,
  Thermometer,
  Camera,
  X,
  Loader2,
  Plus,
  User as UserIcon,
  Heart,
  Hand,
  Activity as Stomach,
  Footprints,
  Eye,
  Settings as Spine,
  Accessibility as Joints
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { diagnosisSchema } from "@/lib/ai"
import { DiagnosisResultView } from "@/components/patient/DiagnosisResultView"

const COMMON_SYMPTOMS = [
  "Fever", "Cough", "Headache", "Fatigue", "Sore Throat",
  "Nausea", "Dizziness", "Shortness of breath", "Muscle Pain",
  "Chest Pain", "Abdominal Pain", "Rash", "Diarrhea", "Vomiting",
  "Loss of taste/smell", "Chills", "Joint Pain", "Skin Irritation"
]

const BODY_PARTS = [
  { id: "head", label: "Head & Neck", icon: <Brain size={24} /> },
  { id: "chest", label: "Chest", icon: <Heart size={24} /> },
  { id: "abdomen", label: "Abdomen", icon: <Stomach size={24} /> },
  { id: "back", label: "Back & Spine", icon: <Spine size={24} /> },
  { id: "limbs", label: "Arms & Legs", icon: <Footprints size={24} /> },
  { id: "joints", label: "Joints", icon: <Joints size={24} /> },
  { id: "skin", label: "Skin", icon: <Activity size={24} /> },
  { id: "whole", label: "Whole Body", icon: <UserIcon size={24} /> },
]

export function DiagnosisWizard() {
  const [step, setStep] = useState(1)
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [customSymptom, setCustomSymptom] = useState("")
  const [isAddingCustom, setIsAddingCustom] = useState(false)
  const [description, setDescription] = useState("")
  const [intensity, setIntensity] = useState(5)
  const [duration, setDuration] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null)

  const [sessionId, setSessionId] = useState<string | null>(null)

  const { object, submit, isLoading } = useObject({
    api: "/api/triage",
    schema: diagnosisSchema,
    onFinish: ({ object }) => {
      if (object?.sessionId) setSessionId(object.sessionId)
      setDiagnosisResult(object)
      setIsProcessing(false)
    }
  })

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    )
  }

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()])
      setCustomSymptom("")
      setIsAddingCustom(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const nextStep = () => setStep(prev => prev + 1)
  const prevStep = () => setStep(prev => prev - 1)

  const handleSubmit = async () => {
    setIsProcessing(true)
    submit({
      bodyPart: selectedBodyPart,
      symptoms: selectedSymptoms,
      description,
      intensity,
      duration,
      images
    })
  }

  if (diagnosisResult) {
    return <DiagnosisResultView result={diagnosisResult} sessionId={sessionId} onRestart={() => {
      setDiagnosisResult(null)
      setStep(1)
      setSelectedBodyPart(null)
      setSelectedSymptoms([])
      setDescription("")
      setImages([])
    }} />
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-0">
      {/* Progress Stepper */}
      <div className="flex justify-between items-center mb-12 relative px-4">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10" />
        <div className="absolute top-1/2 left-0 h-0.5 bg-primary transition-all duration-500 -z-10" 
             style={{ width: `${((step - 1) / 4) * 100}%` }} />
        
        {[1, 2, 3, 4, 5].map((s) => (
          <div 
            key={s}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
              step >= s ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-card border-border text-muted-foreground"
            )}
          >
            {step > s ? <Check size={18} /> : <span className="text-sm font-bold">{s}</span>}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 bg-card/50 border-border backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden min-h-[550px] flex flex-col">
            
            {/* Step 1: Body Part Selection */}
            {step === 1 && (
              <div className="space-y-8 flex-1">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3 justify-center md:justify-start">
                    <UserIcon className="text-primary" size={32} />
                    Where is the issue?
                  </h3>
                  <p className="text-muted-foreground font-medium">Select the primary area of your concern.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {BODY_PARTS.map((part) => (
                    <button
                      key={part.id}
                      onClick={() => {
                        setSelectedBodyPart(part.id)
                        nextStep()
                      }}
                      className={cn(
                        "p-6 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center gap-4 group",
                        selectedBodyPart === part.id
                          ? "bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105"
                          : "bg-secondary/30 border-transparent hover:border-primary/30 text-foreground hover:scale-105"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                        selectedBodyPart === part.id ? "bg-white/20" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                      )}>
                        {part.icon}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{part.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Symptom Checklist */}
            {step === 2 && (
              <div className="space-y-8 flex-1">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                    <Activity className="text-primary" size={32} />
                    What are you feeling?
                  </h3>
                  <p className="text-muted-foreground font-medium">Select symptoms or add your own.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {/* Predefined symptoms */}
                  {COMMON_SYMPTOMS.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all duration-200 text-left relative group",
                        selectedSymptoms.includes(symptom)
                          ? "bg-primary/10 border-primary text-primary shadow-sm"
                          : "bg-secondary/30 border-transparent hover:border-primary/30 text-foreground"
                      )}
                    >
                      <span className="text-xs font-bold">{symptom}</span>
                      {selectedSymptoms.includes(symptom) && (
                        <Check size={14} className="absolute top-2 right-2" />
                      )}
                    </button>
                  ))}

                  {/* Custom symptoms that have been added */}
                  {selectedSymptoms.filter(s => !COMMON_SYMPTOMS.includes(s)).map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className="p-4 rounded-2xl border-2 transition-all duration-200 text-left relative group bg-primary/10 border-primary text-primary shadow-sm"
                    >
                      <span className="text-xs font-bold">{symptom}</span>
                      <Check size={14} className="absolute top-2 right-2" />
                    </button>
                  ))}

                  {/* Custom Symptom Input */}
                  {isAddingCustom ? (
                    <div className="col-span-2 flex items-center gap-2 p-1 bg-secondary/30 rounded-2xl border-2 border-primary/30">
                      <input 
                        autoFocus
                        value={customSymptom}
                        onChange={(e) => setCustomSymptom(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addCustomSymptom()}
                        placeholder="Type symptom..."
                        className="flex-1 bg-transparent border-0 outline-none px-4 text-xs font-bold text-foreground"
                      />
                      <Button size="sm" onClick={addCustomSymptom} className="rounded-xl h-8 w-8 p-0">
                        <Check size={14} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setIsAddingCustom(false)} className="rounded-xl h-8 w-8 p-0">
                        <X size={14} />
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingCustom(true)}
                      className="p-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/30 transition-all text-muted-foreground hover:text-primary flex items-center justify-center gap-2 group"
                    >
                      <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                      <span className="text-xs font-bold uppercase tracking-widest">Other</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Description & Intensity */}
            {step === 3 && (
              <div className="space-y-8 flex-1">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                    <Brain className="text-primary" size={32} />
                    Describe your condition
                  </h3>
                  <p className="text-muted-foreground font-medium">Tell us more about what's happening in your own words.</p>
                </div>

                <div className="space-y-6">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="E.g. I have a sharp pain in my upper abdomen that started after dinner..."
                    className="w-full min-h-[160px] bg-secondary/50 border-border rounded-2xl p-6 text-lg resize-none placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                  />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Pain Intensity</label>
                      <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                        Level {intensity}/10
                      </Badge>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={intensity}
                      onChange={(e) => setIntensity(parseInt(e.target.value))}
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                      <span>Mild</span>
                      <span>Moderate</span>
                      <span>Severe</span>
                      <span>Unbearable</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Duration & Images */}
            {step === 4 && (
              <div className="space-y-8 flex-1">
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
                    <Clock className="text-primary" size={32} />
                    Timeline & Visuals
                  </h3>
                  <p className="text-muted-foreground font-medium">How long has this been going on? Upload photos if relevant.</p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Duration</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["Few Hours", "1-2 Days", "3-5 Days", "1 Week+", "1 Month+"].map((d) => (
                        <button
                          key={d}
                          onClick={() => setDuration(d)}
                          className={cn(
                            "py-3 rounded-xl border-2 transition-all font-bold text-xs",
                            duration === d ? "bg-primary border-primary text-white" : "bg-secondary/30 border-transparent text-foreground"
                          )}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Upload Images (Optional)</label>
                    <div className="flex flex-wrap gap-4">
                      <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer bg-secondary/20 group">
                        <Camera size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary uppercase">Add Photo</span>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>

                      {images.map((img, i) => (
                        <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden group">
                          <img src={img} alt="upload" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Final Review & Submit */}
            {step === 5 && (
              <div className="space-y-8 flex-1 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Stethoscope size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tight text-foreground">Ready for AI Analysis</h3>
                  <p className="text-muted-foreground font-medium max-w-md mx-auto">
                    We've gathered all the necessary information. Our specialist AI will now analyze your symptoms and images.
                  </p>
                </div>

                <div className="w-full bg-secondary/30 rounded-3xl p-6 text-left space-y-4 border border-border/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Body Part</p>
                      <Badge variant="outline" className="text-[10px] uppercase font-black border-primary/20 bg-primary/5 text-primary">
                        {BODY_PARTS.find(p => p.id === selectedBodyPart)?.label || "Whole Body"}
                      </Badge>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 mt-4">Symptoms Selected</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedSymptoms.map(s => <Badge key={s} variant="secondary" className="text-[9px]">{s}</Badge>)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Intensity</p>
                      <p className="text-xl font-black text-primary">{intensity}/10</p>
                    </div>
                  </div>
                </div>

                {isLoading && (
                  <div className="flex flex-col items-center gap-4 py-4">
                    <Loader2 className="animate-spin text-primary" size={32} />
                    <p className="text-xs font-black uppercase tracking-[0.2em] animate-pulse">Scanning Clinical Databases...</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-border mt-auto">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={step === 1 || isLoading}
                className="h-12 px-6 rounded-xl font-bold gap-2 text-muted-foreground"
              >
                <ChevronLeft size={18} />
                Back
              </Button>

              {step < 5 ? (
                <Button
                  onClick={nextStep}
                  disabled={(step === 1 && !selectedBodyPart) || (step === 2 && selectedSymptoms.length === 0)}
                  className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-black shadow-lg shadow-primary/20 gap-2"
                >
                  Continue
                  <ChevronRight size={18} />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="h-14 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/30 gap-3"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Brain size={20} />}
                  Generate Diagnosis
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
