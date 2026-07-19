"use client"

import { useState, useEffect } from "react"
import {
  CheckCircle2,
  AlertTriangle,
  Target,
  Clock,
} from "lucide-react"
import SkeletonLoader from "./SkeletonLoader"

interface CandidateDashboardProps {
  data: any
}

export default function CandidateDashboard({ data }: CandidateDashboardProps) {
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
          <SkeletonLoader height="h-80" />
          <SkeletonLoader height="h-96" />
        </div>
      </div>
    )
  }

  const guidance = data.candidate_guidance
  const resume = data.resume
  const jobDesc = data.job_description

  const getMatchColor = (score: number) => {
    if (score >= 85) return "from-[#606c38] to-[#509c38]"
    if (score >= 70) return "from-[#dda15e] to-[#e8b76f]"
    if (score >= 50) return "from-[#bc6c25] to-[#d07c35]"
    return "from-red-500 to-red-600"
  }


  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Match Score */}
        <div className={`bg-gradient-to-r ${getMatchColor(guidance.overall_match)} rounded-2xl p-8 shadow-lg text-white`}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm font-semibold opacity-90 uppercase tracking-wide mb-2">
                Your Match Score
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-bold">{Math.round(guidance.overall_match)}%</span>
                <span className="text-2xl opacity-75">/100</span>
              </div>
              <p className={`text-lg font-semibold mt-3`}>
                {guidance.match_quality} Fit
              </p>
            </div>

            <div className="bg-white text-[#283618] bg-opacity-15 rounded-lg p-6 backdrop-blur">
              <p className="text-sm font-semibold opacity-90 mb-2">Time to Readiness</p>
              <p className="text-3xl font-bold">{Math.ceil(guidance.timeline_to_readiness)}</p>
              <p className="text-sm opacity-75 mt-1">months to full qualification</p>

              <p className="text-sm font-semibold opacity-90 mt-4 mb-2">Growth Potential</p>
              <p className="text-lg font-bold">{guidance.career_growth_potential}</p>
            </div>
          </div>
        </div>

        {/* Learning Curve Indicator */}
        <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-[#dda15e] rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#283618] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#dda15e]" />
              Learning Curve
            </h3>
            <span className="px-3 py-1 bg-[#fefae0] text-[#283618] text-sm font-semibold rounded-full">
              {guidance.learning_curve}
            </span>
          </div>
          <p className="text-[#606c38]">
            This role requires {guidance.learning_curve.toLowerCase()}. You'll need{" "}
            <span className="font-semibold">
              {guidance.timeline_to_readiness <= 2
                ? "just a couple of weeks"
                : guidance.timeline_to_readiness <= 8
                  ? "a few months"
                  : "significant time"}
            </span>{" "}
            to be fully productive.
          </p>
        </div>

        {/* Your Strengths */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white bg-opacity-70 backdrop-blur-sm border-2 border-[#606c38] rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-[#283618] mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-[#606c38]" />
              What You're Great At
            </h3>

            {guidance.matched_strengths.length > 0 && (
              <div className="mb-6">
                <p className="text-xs uppercase font-semibold text-[#606c38] mb-3">Matched Skills</p>
                <div className="space-y-2">
                  {guidance.matched_strengths.map((strength: string, i: number) => (
                    <div
                      key={i}
                      className="flex gap-3 p-3 bg-[#606c38] bg-opacity-10 rounded-lg border-l-4 border-[#606c38]"
                    >
                      <span className="text-[#606c38] font-bold flex-shrink-0">✓</span>
                      <p className="text-[#283618] text-sm">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {guidance.exceeded_qualifications.length > 0 && (
              <div>
                <p className="text-xs uppercase font-semibold text-[#dda15e] mb-3">Exceeded Qualifications</p>
                <div className="space-y-2">
                  {guidance.exceeded_qualifications.map((qual: string, i: number) => (
                    <div
                      key={i}
                      className="flex gap-3 p-3 bg-[#dda15e] bg-opacity-10 rounded-lg border-l-4 border-[#dda15e]"
                    >
                      <span className="text-[#dda15e] font-bold flex-shrink-0">★</span>
                      <p className="text-[#283618] text-sm">{qual}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Gaps & Needs */}
          <div className="bg-white bg-opacity-70 backdrop-blur-sm border-2 border-[#bc6c25] rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold text-[#283618] mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-[#bc6c25]" />
              What You Need to Work On
            </h3>

            {guidance.critical_gaps.length > 0 && (
              <div className="mb-6">
                <p className="text-xs uppercase font-semibold text-[#bc6c25] mb-3">Critical Gaps</p>
                <div className="space-y-2">
                  {guidance.critical_gaps.map((gap: string, i: number) => (
                    <div
                      key={i}
                      className="flex gap-3 p-3 bg-[#bc6c25] bg-opacity-10 rounded-lg border-l-4 border-[#bc6c25]"
                    >
                      <span className="text-[#bc6c25] font-bold flex-shrink-0">⚠</span>
                      <p className="text-[#283618] text-sm">{gap}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {guidance.nice_to_have_gaps.length > 0 && (
              <div>
                <p className="text-xs uppercase font-semibold text-[#dda15e] mb-3">Nice-to-Have Gaps</p>
                <div className="space-y-2">
                  {guidance.nice_to_have_gaps.slice(0, 3).map((gap: string, i: number) => (
                    <div
                      key={i}
                      className="flex gap-3 p-3 bg-[#dda15e] bg-opacity-10 rounded-lg border-l-4 border-[#dda15e]"
                    >
                      <span className="text-[#dda15e] font-bold flex-shrink-0">•</span>
                      <p className="text-[#283618] text-sm">{gap}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Your Action Plan */}
        <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-[#606c38] rounded-xl p-8 shadow-md">
          <h3 className="text-2xl font-bold text-[#283618] mb-8 flex items-center gap-2">
            <Target className="w-7 h-7 text-[#606c38]" />
            Your Roadmap to Success
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Priority Improvements */}
            <div>
              <h4 className="font-bold text-[#283618] mb-4 text-lg">Priority Focus Areas</h4>
              <div className="space-y-3">
                {guidance.priority_improvements.map((improvement: string, i: number) => (
                  <div
                    key={i}
                    className="flex gap-3 p-4 bg-[#fefae0] rounded-lg border-l-4 border-[#606c38]"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#606c38] text-[#fefae0] flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <p className="text-[#283618] text-sm pt-1">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Items */}
            <div>
              <h4 className="font-bold text-[#283618] mb-4 text-lg">Action Items</h4>
              <div className="space-y-3">
                {guidance.action_plan.map((action: string, i: number) => (
                  <div
                    key={i}
                    className="flex gap-3 p-4 bg-[#fefae0] rounded-lg border-l-4 border-[#dda15e]"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#dda15e] text-[#fefae0] flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <p className="text-[#283618] text-sm pt-1">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Position Overview */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-[#dda15e] rounded-xl p-6 shadow-md">
            <h4 className="font-bold text-[#283618] mb-4">About This Role</h4>
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-semibold text-[#606c38]">Position:</span>{" "}
                <span className="text-[#283618]">{jobDesc.title}</span>
              </p>
              <p>
                <span className="font-semibold text-[#606c38]">Seniority Level:</span>{" "}
                <span className="text-[#283618]">{jobDesc.seniority_level}</span>
              </p>
              <p>
                <span className="font-semibold text-[#606c38]">Experience Required:</span>{" "}
                <span className="text-[#283618]">{jobDesc.required_years} years</span>
              </p>
              <p>
                <span className="font-semibold text-[#606c38]">Remote Policy:</span>{" "}
                <span className="text-[#283618]">{jobDesc.remote_policy}</span>
              </p>
            </div>
          </div>

          <div className="bg-white bg-opacity-70 backdrop-blur-sm border border-[#606c38] rounded-xl p-6 shadow-md">
            <h4 className="font-bold text-[#283618] mb-4">Your Profile</h4>
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-semibold text-[#606c38]">Current Level:</span>{" "}
                <span className="text-[#283618]">{resume.career_level}</span>
              </p>
              <p>
                <span className="font-semibold text-[#606c38]">Experience:</span>{" "}
                <span className="text-[#283618]">{resume.total_experience_years} years</span>
              </p>
              <p>
                <span className="font-semibold text-[#606c38]">Top Skills:</span>{" "}
                <span className="text-[#283618]">
                  {resume.skills.slice(0, 3).map((s: any) => s.name).join(", ")}
                </span>
              </p>
              <p>
                <span className="font-semibold text-[#606c38]">Resume Score:</span>{" "}
                <span className="text-[#283618] font-bold">{data.parse_quality_score}/100</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold text-[#bc6c25] mb-4">Ready to Apply?</h3>
          <p className="text-[#dda15e] mb-6 max-w-2xl mx-auto">
            Your match is <span className="font-bold">{guidance.match_quality.toLowerCase()}</span>.
            {guidance.overall_match >= 75
              ? " You're a strong candidate! Your profile aligns well with what they're looking for."
              : guidance.overall_match >= 50
                ? " You have potential, but focus on the priority areas above to strengthen your application."
                : " You'll need to work on the critical gaps before applying. Use the roadmap above to guide your preparation."}
          </p>
        </div>
      </div>
    </div>
  )
}