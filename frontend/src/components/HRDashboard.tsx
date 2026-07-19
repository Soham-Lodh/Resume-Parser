"use client"

import { useState, useEffect } from "react"
import {
  AlertOctagon,
  TrendingUp,
  Users,
  Award,
} from "lucide-react"
import SkeletonLoader from "./SkeletonLoader"

interface HRDashboardProps {
  data: any
}

export default function HRDashboard({ data }: HRDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <SkeletonLoader height="h-40" />
          <SkeletonLoader height="h-96" />
        </div>
      </div>
    )
  }

  const analytics = data.hr_analytics
  const resume = data.resume

  const getRecommendationColor = (rec: string) => {
    if (rec.includes("Strong Yes")) return "bg-[#606c38]"
    if (rec.includes("Yes")) return "bg-[#dda15e]"
    if (rec.includes("Maybe")) return "bg-[#bc6c25]"
    return "bg-red-500"
  }

  const getRiskColor = (risk: string) => {
    if (risk === "Low") return "text-[#606c38]"
    if (risk === "Medium") return "text-[#dda15e]"
    if (risk === "High") return "text-[#bc6c25]"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Recommendation */}
        <div className="bg-white bg-opacity-70 backdrop-blur-sm border-2 border-[#283618] rounded-xl p-8 shadow-lg">
          <div className="flex items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-[#283618] mb-2">
                Hiring Recommendation
              </h2>
              <p className="text-[#606c38]">Institutional-grade candidate assessment</p>
            </div>
            <div className={`${getRecommendationColor(analytics.hiring_recommendation)} text-white px-8 py-4 rounded-xl text-center`}>
              <p className="text-sm font-semibold uppercase mb-1">Decision</p>
              <p className="text-2xl font-bold">{analytics.hiring_recommendation}</p>
              <p className="text-sm mt-2 opacity-90">
                {Math.round(analytics.hiring_confidence)}% confidence
              </p>
            </div>
          </div>
          <p className="text-[#283618] mt-6 leading-relaxed">{analytics.detailed_analysis}</p>
        </div>

        {/* Scoring Matrix */}
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { label: "Technical", score: analytics.technical_score, icon: "🔧" },
            { label: "Experience", score: analytics.experience_score, icon: "📈" },
            { label: "Education", score: analytics.education_score, icon: "🎓" },
            { label: "Soft Skills", score: analytics.soft_skills_score, icon: "💬" },
            { label: "Culture Fit", score: analytics.culture_fit_score, icon: "🤝" },
          ].map((item, i) => (
            <div key={i} className="bg-white bg-opacity-70 backdrop-blur-sm border border-[#dda15e] rounded-xl p-6 shadow-md">
              <p className="text-2xl mb-2">{item.icon}</p>
              <p className="text-xs uppercase font-semibold text-[#606c38] mb-2">{item.label}</p>
              <div className="mb-3">
                <p className="text-3xl font-bold text-[#283618]">{Math.round(item.score)}</p>
                <p className="text-xs text-[#bc6c25]">/100</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-[#606c38]"
                  style={{ width: `${item.score}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Deal Makers & Deal Breakers */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Deal Makers */}
          <div className="bg-white bg-opacity-70 backdrop-blur-sm border-2 border-[#606c38] rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-[#283618] mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-[#606c38]" />
              Deal Makers
            </h3>
            <div className="space-y-3">
              {analytics.deal_makers.length > 0 ? (
                analytics.deal_makers.map((maker: string, i: number) => (
                  <div key={i} className="flex gap-3 p-3 bg-[#606c38] bg-opacity-10 rounded-lg border-l-4 border-[#606c38]">
                    <span className="text-[#606c38] font-bold flex-shrink-0">✓</span>
                    <p className="text-[#283618] text-sm">{maker}</p>
                  </div>
                ))
              ) : (
                <p className="text-[#606c38] text-sm italic">No exceptional strengths identified</p>
              )}
            </div>
          </div>

          {/* Deal Breakers */}
          <div className="bg-white bg-opacity-70 backdrop-blur-sm border-2 border-red-500 rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-[#283618] mb-6 flex items-center gap-2">
              <AlertOctagon className="w-6 h-6 text-red-500" />
              Deal Breakers
            </h3>
            <div className="space-y-3">
              {analytics.deal_breakers.length > 0 ? (
                analytics.deal_breakers.map((breaker: string, i: number) => (
                  <div key={i} className="flex gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <span className="text-red-600 font-bold flex-shrink-0">✗</span>
                    <p className="text-[#283618] text-sm">{breaker}</p>
                  </div>
                ))
              ) : (
                <p className="text-[#606c38] text-sm italic">No critical deal breakers</p>
              )}
            </div>
          </div>
        </div>

        {/* Strengths & Concerns */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-[#606c38] rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-[#283618] mb-4">✓ Top Strengths</h3>
            <div className="space-y-2">
              {analytics.top_strengths.map((strength: string, i: number) => (
                <p key={i} className="text-[#283618] text-sm flex gap-2">
                  <span className="text-[#606c38] font-bold flex-shrink-0">+</span>
                  {strength}
                </p>
              ))}
            </div>
          </div>

          <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-[#bc6c25] rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-[#283618] mb-4">⚠ Top Concerns</h3>
            <div className="space-y-2">
              {analytics.top_concerns.map((concern: string, i: number) => (
                <p key={i} className="text-[#283618] text-sm flex gap-2">
                  <span className="text-[#bc6c25] font-bold flex-shrink-0">-</span>
                  {concern}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Gap Details */}
        <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-[#dda15e] rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-[#283618] mb-6">Skills Assessment</h3>
          <div className="space-y-3">
            {analytics.skill_gaps.map((gap: any, i: number) => (
              <div
                key={i}
                className={`p-4 rounded-lg border-l-4 ${
                  gap.gap_severity === "Critical"
                    ? "bg-red-50 border-red-500"
                    : gap.gap_severity === "Moderate"
                      ? "bg-[#bc6c25] bg-opacity-10 border-[#bc6c25]"
                      : gap.gap_severity === "Minor"
                        ? "bg-[#dda15e] bg-opacity-10 border-[#dda15e]"
                        : "bg-[#606c38] bg-opacity-10 border-[#606c38]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-[#283618]">{gap.skill_name}</p>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    gap.gap_severity === "Critical"
                      ? "bg-red-200 text-[#fefae0]"
                      : gap.gap_severity === "Moderate"
                        ? "bg-[#bc6c25] bg-opacity-20 text-[#fefae0]"
                        : gap.gap_severity === "Minor"
                          ? "bg-[#dda15e] bg-opacity-20 text-[#fefae0]"
                          : "bg-[#606c38] bg-opacity-20 text-[#fefae0]"
                  }`}>
                    {gap.gap_severity}
                  </span>
                </div>
                <div className="text-xs text-[#text-[#fefae0]] mb-2">
                  Have: <span className="font-semibold">{gap.candidate_level}</span> | 
                  Need: <span className="font-semibold">{gap.required_level}</span> |
                  Importance: <span className="font-semibold">{gap.importance}</span>
                </div>
                {gap.can_learn_quickly && (
                  <p className="text-xs text-[#text-[#fefae0]] mt-2">
                    ✓ Can learn quickly if trained
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Viability Metrics */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-[#283618] rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-[#283618] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Viability Assessment
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase font-semibold text-[#606c38] mb-1">Can Hire Immediately</p>
                <p className="text-lg font-bold text-[#283618]">
                  {analytics.viability.can_hire_immediately ? "✓ Yes" : "✗ No"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-[#606c38] mb-1">Risk Level</p>
                <p className={`text-lg font-bold ${getRiskColor(analytics.viability.risk_level)}`}>
                  {analytics.viability.risk_level}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-[#606c38] mb-1">Training Duration</p>
                <p className="text-lg font-bold text-[#283618]">
                  {Math.ceil(analytics.viability.training_required_months)} months
                </p>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-[#606c38] mb-1">Long-term Potential</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="h-2 rounded-full bg-[#606c38]"
                    style={{ width: `${analytics.viability.long_term_potential}%` }}
                  ></div>
                </div>
                <p className="text-sm font-semibold text-[#283618] mt-1">
                  {Math.round(analytics.viability.long_term_potential)}/100
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-[#dda15e] rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-[#283618] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Interview Intelligence
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase font-semibold text-[#606c38] mb-1">Interview Difficulty</p>
                <p className="text-lg font-bold text-[#283618]">{analytics.interview_difficulty}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-[#606c38] mb-1">Key Discussion Points</p>
                <ul className="text-sm text-[#283618] space-y-1 mt-2">
                  {analytics.negotiation_points.slice(0, 3).map((point: string, i: number) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[#dda15e]">•</span> {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Analysis */}
        <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-[#606c38] rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-[#283618] mb-6">Experience Fit Analysis</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#fefae0] rounded-lg">
              <p className="text-xs uppercase font-semibold text-[#606c38] mb-2">Total Years Match</p>
              <p className="text-lg font-bold text-[#283618]">{data.hr_analytics.experience_analysis.total_years_match}</p>
            </div>
            <div className="p-4 bg-[#fefae0] rounded-lg">
              <p className="text-xs uppercase font-semibold text-[#606c38] mb-2">Years Gap</p>
              <p className="text-lg font-bold text-[#283618]">{data.hr_analytics.experience_analysis.years_gap}</p>
            </div>
            <div className="p-4 bg-[#fefae0] rounded-lg">
              <p className="text-xs uppercase font-semibold text-[#606c38] mb-2">Relevant Experience</p>
              <p className="text-lg font-bold text-[#283618]">{Math.round(data.hr_analytics.experience_analysis.relevant_experience_years)}</p>
            </div>
            <div className="p-4 bg-[#fefae0] rounded-lg">
              <p className="text-xs uppercase font-semibold text-[#606c38] mb-2">Seniority Alignment</p>
              <p className="text-lg font-bold text-[#283618]">{data.hr_analytics.experience_analysis.seniority_alignment}</p>
            </div>
          </div>
        </div>

        {/* Resume Quality */}
        <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-[#283618] rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-[#283618] mb-4">Resume Quality</h3>
          <div className="flex items-center gap-6">
            <div>
              <p className="text-5xl font-bold text-[#606c38]">{Math.round(data.parse_quality_score)}</p>
              <p className="text-xs uppercase font-semibold text-[#606c38]">/100</p>
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="h-4 rounded-full bg-[#606c38]"
                  style={{ width: `${data.parse_quality_score}%` }}
                ></div>
              </div>
              <p className="text-sm text-[#606c38] mt-2">
                {data.parse_quality_score >= 80
                  ? "Well-organized, comprehensive resume"
                  : data.parse_quality_score >= 60
                    ? "Good resume with standard elements"
                    : "Basic resume, some gaps in information"}
              </p>
            </div>
          </div>

          {resume.red_flags.length > 0 && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-semibold text-red-900 mb-2">⚠️ Resume Red Flags</p>
              <ul className="text-sm text-red-800 space-y-1">
                {resume.red_flags.map((flag: string, i: number) => (
                  <li key={i}>• {flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="bg-gradient-to-r from-[#283618] to-[#606c38] text-white rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Interview Decision</h3>
          <p className="text-lg mb-6 opacity-90">
            {analytics.hiring_recommendation.includes("Strong Yes")
              ? "This candidate is exceptional and should be moved to interview immediately."
              : analytics.hiring_recommendation.includes("Yes")
                ? "This candidate meets requirements and is worth interviewing."
                : analytics.hiring_recommendation.includes("Maybe")
                  ? "This candidate has potential but consider other candidates first."
                  : "This candidate does not meet the role requirements."}
          </p>
        </div>
      </div>
    </div>
  )
}