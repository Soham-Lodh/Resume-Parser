"use client"

import { useState, useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import SkeletonLoader from "./SkeletonLoader"

interface ResultsSectionProps {
  data: any
  onBackToUpload: () => void
}

export default function ResultsSection({
  data,
  onBackToUpload,
}: ResultsSectionProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate skeleton loading
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <SkeletonLoader height="h-12" width="w-32" />
          <div className="grid md:grid-cols-2 gap-8">
            <SkeletonLoader height="h-96" />
            <SkeletonLoader height="h-96" />
          </div>
          <SkeletonLoader height="h-80" />
        </div>
      </div>
    )
  }

  const atsResult = data.ats_result
  const resume = data.resume
  const jobDesc = data.job_description

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBackToUpload}
          className="flex items-center gap-2 text-[#dda15e] hover:text-[#bc6c25] font-semibold mb-8 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Upload
        </button>

        {/* ATS Score Banner */}
        <div className="bg-white bg-opacity-70 backdrop-blur-sm border-2 border-[#dda15e] rounded-xl p-8 mb-12 shadow-lg">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div>
              <p className="text-[#606c38] text-sm font-semibold uppercase tracking-wide mb-2">
                Match Score
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold text-[#283618]">
                  {Math.round(atsResult.percentage_match)}%
                </span>
                <span className="text-[#bc6c25] text-xl">/ 100</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="md:col-span-2">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    atsResult.percentage_match >= 75
                      ? "bg-[#606c38]"
                      : atsResult.percentage_match >= 50
                        ? "bg-[#dda15e]"
                        : "bg-[#bc6c25]"
                  }`}
                  style={{ width: `${atsResult.percentage_match}%` }}
                ></div>
              </div>
              <p className="text-[#606c38] text-sm mt-3 leading-relaxed">
                {atsResult.reasoning}
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Resume Section */}
          <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-[#dda15e] rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-[#283618] mb-6 pb-3 border-b-2 border-[#dda15e]">
              Parsed Resume
            </h2>

            {/* Name & Summary */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#606c38] mb-1">
                {resume.name}
              </h3>
              <p className="text-[#bc6c25] leading-relaxed">{resume.summary}</p>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h4 className="font-semibold text-[#283618] mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {resume.skills.slice(0, 8).map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#fefae0] bg-opacity-20 text-[#283618] text-sm rounded-full border border-[#606c38]"
                  >
                    {skill}
                  </span>
                ))}
                {resume.skills.length > 8 && (
                  <span className="px-3 py-1 text-[#606c38] text-sm italic">
                    +{resume.skills.length - 8} more
                  </span>
                )}
              </div>
            </div>

            {/* Education */}
            {resume.education.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-[#283618] mb-3">Education</h4>
                <div className="space-y-3">
                  {resume.education.map((edu: any, i: number) => (
                    <div key={i} className="text-sm">
                      <p className="font-semibold text-[#283618]">{edu.degree}</p>
                      <p className="text-[#606c38]">{edu.institution}</p>
                      <p className="text-xs text-[#bc6c25]">{edu.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Preview */}
            {resume.experience.length > 0 && (
              <div>
                <h4 className="font-semibold text-[#283618] mb-3">Experience</h4>
                <div className="space-y-3">
                  {resume.experience.slice(0, 2).map((exp: any, i: number) => (
                    <div key={i} className="text-sm border-l-2 border-[#dda15e] pl-3">
                      <p className="font-semibold text-[#283618]">{exp.role}</p>
                      <p className="text-[#606c38]">{exp.company}</p>
                      <p className="text-xs text-[#bc6c25]">{exp.duration}</p>
                    </div>
                  ))}
                  {resume.experience.length > 2 && (
                    <p className="text-sm text-[#606c38] italic">
                      +{resume.experience.length - 2} more position(s)
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Job Description Section */}
          <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-[#dda15e] rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold text-[#283618] mb-6 pb-3 border-b-2 border-[#dda15e]">
              Job Requirements
            </h2>

            {/* Job Title & Location */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#606c38] mb-1">
                {jobDesc.title}
              </h3>
              <p className="text-[#bc6c25] text-sm mb-2">{jobDesc.location}</p>
              {jobDesc.salary_range && (
                <p className="text-[#283618] font-semibold text-sm">
                  {jobDesc.salary_range}
                </p>
              )}
            </div>

            {/* Key Responsibilities */}
            {jobDesc.responsibilities.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-[#283618] mb-3">
                  Key Responsibilities
                </h4>
                <ul className="space-y-2">
                  {jobDesc.responsibilities.slice(0, 4).map((resp: string, i: number) => (
                    <li
                      key={i}
                      className="text-sm text-[#606c38] flex gap-2"
                    >
                      <span className="text-[#dda15e] font-bold">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                  {jobDesc.responsibilities.length > 4 && (
                    <li className="text-sm text-[#606c38] italic">
                      +{jobDesc.responsibilities.length - 4} more responsibility
                      {jobDesc.responsibilities.length - 4 !== 1 ? "ies" : ""}
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Required Qualifications */}
            {jobDesc.required_qualifications.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-[#283618] mb-3">
                  Required Qualifications
                </h4>
                <ul className="space-y-2">
                  {jobDesc.required_qualifications.slice(0, 4).map((qual: string, i: number) => (
                    <li
                      key={i}
                      className="text-sm text-[#606c38] flex gap-2"
                    >
                      <span className="text-[#606c38] font-bold">✓</span>
                      <span>{qual}</span>
                    </li>
                  ))}
                  {jobDesc.required_qualifications.length > 4 && (
                    <li className="text-sm text-[#606c38] italic">
                      +{jobDesc.required_qualifications.length - 4} more
                      requirement
                      {jobDesc.required_qualifications.length - 4 !== 1 ? "s" : ""}
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Preferred Qualifications */}
            {jobDesc.preferred_qualifications.length > 0 && (
              <div>
                <h4 className="font-semibold text-[#283618] mb-3">
                  Preferred Qualifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {jobDesc.preferred_qualifications.slice(0, 5).map((pref: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-[#dda15e] bg-opacity-20 text-[#bc6c25] text-xs rounded border border-[#dda15e]"
                    >
                      {pref}
                    </span>
                  ))}
                  {jobDesc.preferred_qualifications.length > 5 && (
                    <span className="text-xs text-[#606c38] italic">
                      +{jobDesc.preferred_qualifications.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-[#dda15e] rounded-xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-[#283618] mb-6 pb-3 border-b-2 border-[#dda15e]">
            Improvement Suggestions
          </h2>

          <div className="space-y-4">
            {atsResult.improvement_suggestions.map((suggestion: string, i: number) => (
              <div
                key={i}
                className="flex gap-4 p-4 bg-[#fefae0] bg-opacity-50 rounded-lg border-l-4 border-[#bc6c25] hover:bg-opacity-100 transition-all"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#dda15e] text-[#fefae0] flex items-center justify-center font-semibold text-sm">
                  {i + 1}
                </div>
                <p className="text-[#283618] text-sm leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <button
            onClick={onBackToUpload}
            className="px-8 py-3 bg-[#606c38] text-[#fefae0] rounded-lg font-semibold hover:bg-[#283618] transition-colors shadow-md"
          >
            Analyze Another Resume
          </button>
        </div>
      </div>
    </div>
  )
}