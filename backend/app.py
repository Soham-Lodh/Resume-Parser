import json
import os

from dotenv import load_dotenv
from groq import Groq
from pydantic import BaseModel

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")
if not API_KEY:
    raise ValueError("GROQ_API_KEY not found.")

client = Groq(api_key=API_KEY)

MODEL = "llama-3.3-70b-versatile"

RESPONSE_FORMAT = {
    "type": "json_object"
}


# ---------------- Resume ---------------- #

class Project(BaseModel):
    title: str
    description: str
    technologies: list[str]


class Experience(BaseModel):
    company: str
    role: str
    duration: str
    description: str


class Certification(BaseModel):
    name: str
    issuer: str


class Education(BaseModel):
    institution: str
    degree: str
    duration: str


class Resume(BaseModel):
    name: str
    summary: str
    skills: list[str]
    projects: list[Project]
    experience: list[Experience]
    certifications: list[Certification]
    education: list[Education]


# ---------------- Job Description ---------------- #

class JobDescription(BaseModel):
    title: str
    description: str
    location: str
    required_qualifications: list[str]
    preferred_qualifications: list[str]
    education_requirements: list[str]
    salary_range: str
    responsibilities: list[str]


# ---------------- ATS Result ---------------- #

class ATSResult(BaseModel):
    percentage_match: float
    reasoning: str
    improvement_suggestions: list[str]


# ---------------- Final Output ---------------- #

class Analysis(BaseModel):
    resume: Resume
    job_description: JobDescription
    ats_result: ATSResult


SCHEMA = Analysis.model_json_schema()


SYSTEM_PROMPT = f"""
You are an expert Applicant Tracking System (ATS), HR Recruiter,
and Resume Parser.

You must perform ALL of the following tasks.

1. Parse the resume.
2. Parse the job description.
3. Compare them.
4. Calculate ATS percentage.
5. Explain the score.
6. Suggest improvements.

Return ONLY valid JSON.

The JSON MUST strictly follow this schema.

{json.dumps(SCHEMA, indent=2)}
"""


def analyze(resume_text: str, job_description_text: str) -> Analysis:
    response = client.chat.completions.create(
        model=MODEL,
        temperature=0,
        response_format=RESPONSE_FORMAT,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": f"""
Resume

{resume_text}

----------------------------

Job Description

{job_description_text}
"""
            }
        ]
    )

    return Analysis.model_validate_json(
        response.choices[0].message.content
    )