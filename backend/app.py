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
MODEL = "openai/gpt-oss-120b"

RESPONSE_FORMAT = {"type": "json_object"}


# ==================== ENHANCED RESUME MODELS ==================== #

class Skill(BaseModel):
    name: str = ""
    proficiency: str = "Unknown"
    years: float = 0
    verified: bool = False


class ProjectMetrics(BaseModel):
    title: str = ""
    description: str = ""
    technologies: list[str] = Field(default_factory=list)
    duration: str = ""
    impact: str = ""
    role: str = ""
    verification_score: float = 0


class ExperienceEntry(BaseModel):
    company: str = ""
    role: str = ""
    start_date: str = ""
    duration: str = ""
    duration_months: float = 0
    description: str = ""
    key_achievements: list[str] = Field(default_factory=list)
    team_size: int = 0
    technologies: list[str] = Field(default_factory=list)
    seniority_level: str = "Entry"


class Certification(BaseModel):
    name: str = ""
    issuer: str = ""
    description: str = ""
    year_obtained: int = 0
    is_active: bool = True


class Education(BaseModel):
    institution: str = ""
    degree: str = ""
    duration: str = ""
    field_of_study: str = ""
    gpa: str = ""
    honors: str = ""


class Resume(BaseModel):

    # Personal
    name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    linkedin_url: str = ""
    portfolio_url: str = ""

    # Profile
    professional_summary: str = ""
    total_experience_years: float = 0
    career_level: str = "Entry"

    # Resume Data
    skills: list[Skill] = Field(default_factory=list)
    experience: list[ExperienceEntry] = Field(default_factory=list)
    education: list[Education] = Field(default_factory=list)
    certifications: list[Certification] = Field(default_factory=list)
    projects: list[ProjectMetrics] = Field(default_factory=list)

    # Metadata
    additional_information: str = ""
    consistency_score: float = 0
    red_flags: list[str] = Field(default_factory=list)
    strengths: list[str] = Field(default_factory=list)
    missing_common_elements: list[str] = Field(default_factory=list)


# ==================== JOB DESCRIPTION ====================



class JobDescription(BaseModel):
    title: str = ""
    company: str = ""
    category: str = ""
    seniority_level: str = "Entry"

    required_years: float = 0
    years_in_role: float = 0

    location: str = ""
    remote_policy: str = ""
    relocation_provided: bool = False

    description: str = ""

    responsibilities: list[str] = Field(default_factory=list)

    required_skills: list[str] = Field(default=[])
    preferred_skills: list[str] = Field(default=[])
    nice_to_have: list[str] = Field(default_factory=list)

    education_requirements: list[str] = Field(default_factory=list)
    certifications_required: list[str] = Field(default_factory=list)

    salary_min: float = 0
    salary_max: float = 0
    salary_currency: str = ""

    tech_stack: list[str] = Field(default_factory=list)

    team_size: int = 0
    reports_to: str = ""

    growth_path: str = ""
    travel_required: int = 0


# ==================== HR ANALYTICS ====================

class SkillGapAnalysis(BaseModel):
    skill_name: str = ""
    candidate_level: str = "Unknown"
    required_level: str = "Unknown"
    gap_severity: str = "None"
    can_learn_quickly: bool = False
    importance: str = "Medium"


class ExperienceFitAnalysis(BaseModel):
    total_years_match: str = "Perfect"
    years_gap: float = 0
    relevant_experience_years: float = 0
    seniority_alignment: str = "Perfect"
    progression_quality: str = "Average"


class EducationFitAnalysis(BaseModel):
    required_met: bool = False
    perfect_match: bool = False
    alternative_paths_available: bool = False
    bonus_education: list[str] = Field(default_factory=list)
    education_score: float = 0


class CandidateViabilityScore(BaseModel):
    overall_fit: float = 0
    can_hire_immediately: bool = False
    training_required_months: float = 0
    risk_level: str = "Medium"
    long_term_potential: float = 0


class HRAnalytics(BaseModel):

    technical_score: float = 0
    experience_score: float = 0
    education_score: float = 0
    soft_skills_score: float = 0
    culture_fit_score: float = 0

    skill_gaps: list[SkillGapAnalysis] = Field(default_factory=list)

    experience_analysis: ExperienceFitAnalysis = Field(
        default_factory=ExperienceFitAnalysis
    )

    education_analysis: EducationFitAnalysis = Field(
        default_factory=EducationFitAnalysis
    )

    viability: CandidateViabilityScore = Field(
        default_factory=CandidateViabilityScore
    )

    top_strengths: list[str] = Field(default_factory=list)
    top_concerns: list[str] = Field(default_factory=list)
    deal_breakers: list[str] = Field(default_factory=list)
    deal_makers: list[str] = Field(default_factory=list)

    interview_difficulty: str = "Medium"
    negotiation_points: list[str] = Field(default_factory=list)
    hiring_recommendation: str = "Maybe"
    hiring_confidence: float = 0

    detailed_analysis: str = ""


# ==================== CANDIDATE GUIDANCE ====================

class CandidateGuidance(BaseModel):
    overall_match: float = 0
    match_quality: str = "Poor"

    matched_strengths: list[str] = Field(default_factory=list)
    exceeded_qualifications: list[str] = Field(default_factory=list)

    critical_gaps: list[str] = Field(default_factory=list)
    nice_to_have_gaps: list[str] = Field(default_factory=list)

    learning_curve: str = ""

    action_plan: list[str] = Field(default_factory=list)
    priority_improvements: list[str] = Field(default_factory=list)

    timeline_to_readiness: float = 0
    career_growth_potential: str = ""


# ==================== FINAL ====================

class ProfessionalAnalysis(BaseModel):
    resume: Resume = Field(default_factory=Resume)
    job_description: JobDescription = Field(default_factory=JobDescription)
    hr_analytics: HRAnalytics = Field(default_factory=HRAnalytics)
    candidate_guidance: CandidateGuidance = Field(default_factory=CandidateGuidance)
    parse_quality_score: float = 0


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