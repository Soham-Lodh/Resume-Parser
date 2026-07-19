"use client"

import { useEffect, useState } from "react"
import FileUploadSection from "./components/FileUploadSection"
import CandidateDashboard from "./components/CandidateDashboard"
import HRDashboard from "./components/HRDashboard"
import Toast from "./components/Toast"
import ShaderBackground from "./components/ShaderBackground"

type Toast = {
  id: string
  message: string
  type: "success" | "error" | "warning"
}

type ViewMode = "upload" | "candidate" | "hr"

export default function App() {
  const [stage, setStage] = useState<ViewMode>("upload")
  const [viewMode, setViewMode] = useState<"candidate" | "hr">("candidate")
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

  // Backend warm-up
  useEffect(() => {
    const wakeBackend = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"
        await fetch(`${API_URL}/`, { method: "GET" })
      } catch (err) {
        console.log("Backend wake-up initiated")
      }
    }
    wakeBackend()
  }, [])

  const handleAnalyze = async (resume: File, jobDescription: File) => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

    // Validation
    const allowedTypes = [".pdf", ".docx", ".md"]
    const maxSize = 10 * 1024 * 1024

    const resumeExt = "." + resume.name.split(".").pop()?.toLowerCase()
    const jdExt = "." + jobDescription.name.split(".").pop()?.toLowerCase()

    if (!allowedTypes.includes(resumeExt)) {
      addToast("Resume format not supported. Use PDF, DOCX, or MD", "error")
      return
    }
    if (!allowedTypes.includes(jdExt)) {
      addToast("Job description format not supported", "error")
      return
    }
    if (resume.size > maxSize) {
      addToast("Resume exceeds 10MB limit", "error")
      return
    }
    if (jobDescription.size > maxSize) {
      addToast("Job description exceeds 10MB limit", "error")
      return
    }

    setLoading(true)
    addToast("Analyzing your resume with institutional-grade rigor...", "success")

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
      setStage("candidate")
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
    setViewMode("candidate")
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
          <>
            {/* View Toggle (in results) */}
            <div className="sticky top-0 z-40 bg-white bg-opacity-60 backdrop-blur-sm border-b border-[#dda15e] px-4 py-3">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <button
                  onClick={handleBackToUpload}
                  className="px-4 py-2 text-[#606c38] hover:text-[#283618] cursor-pointer font-semibold bg-[#dda15e] rounded-lg  transition-colors"
                >
                  ← Back
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("candidate")}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                      viewMode === "candidate"
                        ? "bg-[#606c38] text-[#fefae0] shadow-md"
                        : "bg-white text-[#606c38] border border-[#606c38] hover:bg-[#fefae0]"
                    }`}
                  >
                    Candidate View
                  </button>
                  <button
                    onClick={() => setViewMode("hr")}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                      viewMode === "hr"
                        ? "bg-[#283618] text-[#fefae0] shadow-md"
                        : "bg-white text-[#283618] border border-[#283618] hover:bg-[#fefae0]"
                    }`}
                  >
                    HR View
                  </button>
                </div>

                <div className="w-24"></div>
              </div>
            </div>

            {/* Dashboard Content */}
            {viewMode === "candidate" ? (
              <CandidateDashboard data={analysisResult} />
            ) : (
              <HRDashboard data={analysisResult} />
            )}
          </>
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