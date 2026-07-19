import json
import os
from dotenv import load_dotenv
from groq import Groq
from pydantic import BaseModel, Field
from typing import Optional

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")
if not API_KEY:
    raise ValueError("GROQ_API_KEY not found.")

client = Groq(api_key=API_KEY)
MODEL = "llama-3.3-70b-versatile"

RESPONSE_FORMAT = {"type": "json_object"}


# ==================== ENHANCED RESUME MODELS ==================== #

class Skill(BaseModel):
    name: str
    proficiency: str = Field(description="Beginner, Intermediate, Advanced, Expert")
    years: float = Field(default=0)
    verified: bool = Field(default=False, description="Can be verified from resume text")


class ProjectMetrics(BaseModel):
    title: str
    description: str
    technologies: list[str]
    duration: str
    impact: str = Field(default="", description="Measurable impact or outcome")
    role: str = Field(default="")
    verification_score: float = Field(default=0.0, description="0-100 confidence this was real")


class ExperienceEntry(BaseModel):
    company: str
    role: str
    duration: str
    duration_months: float = Field(default=0)
    description: str
    key_achievements: list[str] = Field(default_factory=list)
    team_size: int = Field(default=0)
    technologies: list[str] = Field(default_factory=list)
    seniority_level: str = Field(description="Junior, Mid-level, Senior, Lead, Executive")


class Certification(BaseModel):
    name: str
    issuer: str
    description: str=Field(default="")
    year_obtained: int = Field(default=0)
    is_active: bool = Field(default=True)


class Education(BaseModel):
    institution: str
    degree: str
    duration: str
    field_of_study: str
    gpa: str = Field(default="")
    honors: str = Field(default="")


class Resume(BaseModel):
    # Personal
    name: str
    email: str = Field(default="")
    phone: str = Field(default="")
    location: str = Field(default="")
    linkedin_url: str = Field(default="")
    portfolio_url: str = Field(default="")

    # Profile
    professional_summary: str
    total_experience_years: float
    career_level: str = Field(description="Entry, Junior, Mid, Senior, Lead, Director, C-Level")

    # Core Data
    skills: list[Skill]
    experience: list[ExperienceEntry]
    education: list[Education]
    certifications: list[Certification]
    projects: list[ProjectMetrics]

    # Flags & Indicators
    additional_information: str = Field(default="")
    consistency_score: float = Field(default=0.0, description="0-100: How consistent is the resume")
    red_flags: list[str] = Field(default_factory=list)
    strengths: list[str] = Field(default_factory=list)
    missing_common_elements: list[str] = Field(default_factory=list)


# ==================== ENHANCED JOB DESCRIPTION ==================== #

class JobSkillRequirement(BaseModel):
    name: str
    proficiency_required: str
    years_required: float = Field(default=0)
    is_critical: bool = Field(default=False)
    weight: float = Field(default=1.0, description="0-1, importance multiplier")


class JobDescription(BaseModel):
    title: str
    company: str = Field(default="")
    category: str = Field(default="")
    seniority_level: str = Field(description="Entry, Junior, Mid, Senior, Lead, Director")
    required_years: float
    years_in_role: float = Field(default=0)
    
    location: str
    remote_policy: str = Field(default="Onsite", description="Onsite, Hybrid, Remote, Flexible")
    relocation_provided: bool = Field(default=False)

    description: str
    responsibilities: list[str]
    required_skills: list[JobSkillRequirement]
    preferred_skills: list[JobSkillRequirement] = Field(default_factory=list)
    nice_to_have: list[str] = Field(default_factory=list)

    education_requirements: list[str]
    certifications_required: list[str] = Field(default_factory=list)
    
    salary_min: float = Field(default=0)
    salary_max: float = Field(default=0)
    salary_currency: str = Field(default="USD")

    tech_stack: list[str] = Field(description="Specific technologies required")
    team_size: int = Field(default=0)
    reports_to: str = Field(default="")

    growth_path: str = Field(default="")
    travel_required: int = Field(default=0, description="% of time")


# ==================== PROFESSIONAL ATS ANALYSIS ==================== #

class SkillGapAnalysis(BaseModel):
    skill_name: str
    candidate_level: str
    required_level: str
    gap_severity: str = Field(description="None, Minor, Moderate, Critical")
    can_learn_quickly: bool = Field(default=False)
    importance: str = Field(description="Critical, High, Medium, Nice-to-have")


class ExperienceFitAnalysis(BaseModel):
    total_years_match: str = Field(description="Under, Perfect, Over")
    years_gap: float
    relevant_experience_years: float = Field(default=0)
    seniority_alignment: str = Field(description="Under, Perfect, Over")
    progression_quality: str = Field(description="Weak, Average, Strong, Exceptional")


class EducationFitAnalysis(BaseModel):
    required_met: bool
    perfect_match: bool
    alternative_paths_available: bool = Field(default=False)
    bonus_education: list[str] = Field(default_factory=list)
    education_score: float = Field(default=0.0)


class CandidateViabilityScore(BaseModel):
    overall_fit: float = Field(description="0-100")
    can_hire_immediately: bool
    training_required_months: float = Field(default=0)
    risk_level: str = Field(description="Low, Medium, High, Critical")
    long_term_potential: float = Field(description="0-100")


class HRAnalytics(BaseModel):
    # Scoring Breakdown
    technical_score: float = Field(description="0-100")
    experience_score: float = Field(description="0-100")
    education_score: float = Field(description="0-100")
    soft_skills_score: float = Field(description="0-100, inferred from resume")
    culture_fit_score: float = Field(description="0-100, subjective estimation")

    # Detailed Analysis
    skill_gaps: list[SkillGapAnalysis]
    experience_analysis: ExperienceFitAnalysis
    education_analysis: EducationFitAnalysis
    viability: CandidateViabilityScore

    # Strengths & Concerns
    top_strengths: list[str]
    top_concerns: list[str]
    deal_breakers: list[str] = Field(default_factory=list)
    deal_makers: list[str] = Field(default_factory=list)

    # HR Recommendations
    interview_difficulty: str = Field(description="Easy, Medium, Hard, Very Hard")
    negotiation_points: list[str] = Field(default_factory=list)
    hiring_recommendation: str = Field(description="Strong Yes, Yes, Maybe, No, Strong No")
    hiring_confidence: float = Field(description="0-100")

    # Detailed Reasoning
    detailed_analysis: str


class CandidateGuidance(BaseModel):
    overall_match: float = Field(description="0-100")
    match_quality: str = Field(description="Perfect, Great, Good, Fair, Poor")

    # What They Have
    matched_strengths: list[str]
    exceeded_qualifications: list[str]

    # What They Need
    critical_gaps: list[str]
    nice_to_have_gaps: list[str]
    learning_curve: str = Field(description="Easy (< 2 weeks), Moderate (2-8 weeks), Difficult (2-6 months), Very Difficult (> 6 months)")

    # Path to Success
    action_plan: list[str] = Field(description="Specific actions to improve fit")
    priority_improvements: list[str] = Field(description="What to focus on first")
    timeline_to_readiness: float = Field(description="Months needed to be fully qualified")
    career_growth_potential: str = Field(description="Limited, Moderate, Strong, Exceptional")


# ==================== FINAL OUTPUT ==================== #

class ProfessionalAnalysis(BaseModel):
    resume: Resume
    job_description: JobDescription
    hr_analytics: HRAnalytics
    candidate_guidance: CandidateGuidance
    parse_quality_score: float = Field(description="0-100, confidence in parsing accuracy")


SCHEMA = ProfessionalAnalysis.model_json_schema()

SYSTEM_PROMPT = f"""
You are an ELITE institutional resume parser and ATS system used by Fortune 500 companies.
You have processed 50,000+ resumes and conducted 10,000+ hiring cycles.

Your parsing must be STRICT, ACCURATE, and INSTITUTIONAL-GRADE.

CRITICAL RULES:

1. PARSE WITH MILITARY PRECISION
   - Extract exact dates and calculate months
   - Identify career progression (gaps, jumps, lateral moves)
   - Quantify achievements wherever visible
   - Flag inconsistencies (date mismatches, role inconsistencies)
   - Assess resume quality itself (completeness, clarity, professionalism)

2. SKILL VERIFICATION RULES
   - Mark skills as "verified" ONLY if mentioned in experience/projects
   - Proficiency levels: Extract from context, don't guess
   - Years calculation: Based on when skills appear in roles
   - Red flags: Contradictory skill claims, unrealistic proficiency timelines

3. EXPERIENCE ANALYSIS
   - Calculate exact tenure in months (not "3 years", but 36 months)
   - Identify seniority level progression
   - Extract team leadership indicators
   - Note company scale/prestige where evident
   - Flag job hopping (< 1 year roles)

4. CONSISTENCY SCORING (0-100)
   - Total experience matches dates: +20 points
   - No unexplained gaps: +20 points
   - Clear career progression: +20 points
   - Skills align with roles: +20 points
   - Professional presentation: +20 points

5. MATCHING RULES (for HR)
   - Technical score: Skill-by-skill comparison with proficiency levels
   - Experience score: Years + Seniority alignment
   - Education score: Degree match, certifications, honors
   - Soft skills: Inferred from achievements, team sizes, progression
   - Culture fit: Subjective but data-driven (company size history, growth, etc)

6. DEAL BREAKERS vs DEAL MAKERS
   - Deal breaker examples: No required degree, explicitly disqualifying skill gap, red flags
   - Deal maker examples: Exceptional background, rare skills, proven track record in exact role
   - Be specific, not generic

7. CANDIDATE GUIDANCE (Empathetic but Honest)
   - What they're good at (verified, specific)
   - What they're missing (honest assessment with timeline)
   - How to improve (actionable, prioritized)
   - Realistic timeline to readiness
   - Career potential in this role (realistic)

8. RED FLAGS TO IDENTIFY
   - Frequent job changes without progression
   - Roles that don't make career sense
   - Missing employment gaps (unexplained)
   - Inflated titles for company size
   - Skills that don't align with experience
   - Date mismatches or logical inconsistencies
   - No contact information (incomplete)
   - Vague descriptions (low quality)

9. STRENGTHS TO HIGHLIGHT
   - Clear career progression with growth
   - Consistent skill building
   - Relevant experience at scale
   - Quantified achievements
   - Leadership progression
   - Learning from failures/pivots
   - Professional presentation

RESPONSE MUST:
- Be institutional-grade (no vague language)
- Provide confidence scores (0-100) for all subjective assessments
- Include specific reasoning, not generic statements
- Use exact data from resume (dates, titles, companies)
- Flag assumptions and uncertainties

Return ONLY valid JSON matching this exact schema:

{json.dumps(SCHEMA, indent=2)}
"""


def analyze(resume_text: str, job_description_text: str) -> ProfessionalAnalysis:
    """
    Professional-grade resume analysis for institutions.
    Strict parsing, comprehensive metrics, actionable insights.
    """
    response = client.chat.completions.create(
        model=MODEL,
        temperature=0,  # Deterministic
        response_format=RESPONSE_FORMAT,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": f"""Analyze this resume against this job with institutional-grade rigor.

RESUME:
{resume_text}

---

JOB DESCRIPTION:
{job_description_text}

Provide comprehensive, accurate, institutional-grade analysis."""
            }
        ]
    )

    return ProfessionalAnalysis.model_validate_json(
        response.choices[0].message.content
    )