"use client"

import { useEffect,useState } from "react"
import FileUploadSection from "./components/FileUploadSection"
import ResultsSection from "./components/ResultsSection"
import Toast from "./components/Toast"
import ShaderBackground from "./components/ShaderBackground"

type Toast = {
  id: string
  message: string
  type: "success" | "error" | "warning"
}

export default function App() {
  const [stage, setStage] = useState<"upload" | "results">("upload")
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: "success" | "error" | "warning" = "success") => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Call backend home endpoint on mount to warm up Render
  useEffect(() => {
    const wakeBackend = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"
        await fetch(`${API_URL}/`, { method: "GET" })
      } catch (err) {
        console.log("Backend wake-up call initiated")
      }
    }

    wakeBackend()
  }, [])

  const handleAnalyze = async (resume: File, jobDescription: File) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

    // Validate files
    const allowedTypes = [".pdf", ".docx", ".md"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    const resumeExt = "." + resume.name.split(".").pop()?.toLowerCase()
    const jdExt = "." + jobDescription.name.split(".").pop()?.toLowerCase()

    if (!allowedTypes.includes(resumeExt)) {
      addToast(`Resume format not supported. Use PDF, DOCX, or MD`, "error")
      return
    }

    if (!allowedTypes.includes(jdExt)) {
      addToast(`Job description format not supported. Use PDF, DOCX, or MD`, "error")
      return
    }

    if (resume.size > maxSize) {
      addToast(`Resume exceeds 10MB limit`, "error")
      return
    }

    if (jobDescription.size > maxSize) {
      addToast(`Job description exceeds 10MB limit`, "error")
      return
    }

    setLoading(true)
    addToast("Analyzing your resume...", "success")

    const formData = new FormData()
    formData.append("resume", resume)
    formData.append("job_description", jobDescription)

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const data = await response.json()
      setAnalysisResult(data)
      setStage("results")
      addToast("Analysis complete!", "success")
    } catch (err) {
      console.error("Analysis error:", err)
      addToast(
        err instanceof Error ? err.message : "Failed to analyze files",
        "error"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleBackToUpload = () => {
    setStage("upload")
    setAnalysisResult(null)
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-b from-[#fefae0] to-[#f5f1e8]">
      {/* Fixed Shader Background */}
      <ShaderBackground />

      {/* Content Overlay */}
      <div className="relative z-10">
        {stage === "upload" ? (
          <FileUploadSection onAnalyze={handleAnalyze} loading={loading} />
        ) : (
          <ResultsSection
            data={analysisResult}
            onBackToUpload={handleBackToUpload}
          />
        )}
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  )
}