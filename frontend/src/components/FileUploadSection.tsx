"use client"

import { useState, useRef } from "react"
import { Upload, FileText, CheckCircle } from "lucide-react"

interface FileUploadSectionProps {
  onAnalyze: (resume: File, jobDescription: File) => void
  loading: boolean
}

export default function FileUploadSection({
  onAnalyze,
  loading,
}: FileUploadSectionProps) {
  const [resume, setResume] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const jdInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent, type: "resume" | "jd") => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      if (type === "resume") {
        setResume(files[0])
      } else {
        setJobDescription(files[0])
      }
    }
  }

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "resume" | "jd"
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === "resume") {
        setResume(file)
      } else {
        setJobDescription(file)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (resume && jobDescription) {
      onAnalyze(resume, jobDescription)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-[#bc6c25] mb-4">
            Resume Analyzer
          </h1>
          <p className="text-lg text-[#dda15e] max-w-2xl mx-auto leading-relaxed">
            Upload your resume and job description to get instant AI-powered insights
            on your match score and personalized improvement suggestions.
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Resume Upload */}
          <div>
            <label className="block text-xl font-semibold text-[#bc6c25] mb-3">
              Your Resume
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop(e, "resume")}
              onClick={() => resumeInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-200 ${
                dragActive
                  ? "border-[#dda15e] bg-[#fefae0] bg-opacity-50"
                  : "border-[#dda15e] hover:border-[#bc6c25] bg-white bg-opacity-40"
              }`}
            >
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.docx,.md"
                onChange={(e) => handleFileSelect(e, "resume")}
                className="hidden"
              />

              {resume ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="w-6 h-6 text-[#606c38]" />
                  <div className="text-left">
                    <p className="font-semibold text-[#283618]">{resume.name}</p>
                    <p className="text-sm text-[#606c38]">
                      {(resume.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-8 h-8 text-[#dda15e]" />
                  <div>
                    <p className="font-semibold text-[#283618]">
                      Drop your resume here
                    </p>
                    <p className="text-sm text-[#606c38]">
                      PDF, DOCX, or MD • Up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job Description Upload */}
          <div>
            <label className="block text-xl font-semibold text-[#bc6c25] mb-3">
              Job Description
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop(e, "jd")}
              onClick={() => jdInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-200 ${
                dragActive
                  ? "border-[#dda15e] bg-[#fefae0] bg-opacity-50"
                  : "border-[#dda15e] hover:border-[#bc6c25] bg-white bg-opacity-40"
              }`}
            >
              <input
                ref={jdInputRef}
                type="file"
                accept=".pdf,.docx,.md"
                onChange={(e) => handleFileSelect(e, "jd")}
                className="hidden"
              />

              {jobDescription ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="w-6 h-6 text-[#606c38]" />
                  <div className="text-left">
                    <p className="font-semibold text-[#283618]">
                      {jobDescription.name}
                    </p>
                    <p className="text-sm text-[#606c38]">
                      {(jobDescription.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <FileText className="w-8 h-8 text-[#dda15e]" />
                  <div>
                    <p className="font-semibold text-[#283618]">
                      Drop job description here
                    </p>
                    <p className="text-sm text-[#606c38]">
                      PDF, DOCX, or MD • Up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={!resume || !jobDescription || loading}
              className={`px-12 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
                resume && jobDescription && !loading
                  ? "bg-[#606c38] text-[#fefae0] hover:bg-[#283618] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-transparent border-t-[#fefae0] rounded-full animate-spin"></span>
                  Analyzing...
                </span>
              ) : (
                "Analyze Resume"
              )}
            </button>
          </div>
        </form>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            {
              icon: "✓",
              title: "Instant Analysis",
              desc: "Get ATS score and match percentage in seconds",
            },
            {
              icon: "★",
              title: "AI Insights",
              desc: "Powered by advanced LLM analysis",
            },
            {
              icon: "🎯",
              title: "Actionable",
              desc: "Specific improvement suggestions included",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="bg-white bg-opacity-50 backdrop-blur-sm border border-[#dda15e] rounded-lg p-6 text-center hover:bg-opacity-70 transition-all"
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="font-bold text-[#283618] mb-2">{card.title}</h3>
              <p className="text-sm text-[#606c38]">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
