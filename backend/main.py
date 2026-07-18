from fastapi import FastAPI,HTTPException,UploadFile, File
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from app import analyze as analyze_resume
import fitz
from io import BytesIO
from docx import Document
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".md"}


async def extract_text(file: UploadFile) -> str:
    if not file.filename:
        raise HTTPException(status_code=400, detail="File name is missing.")

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {extension}"
        )

    file_bytes = await file.read()

    if extension == ".pdf":
        pdf = fitz.open(stream=file_bytes, filetype="pdf")
        text = "\n".join(page.get_text() for page in pdf)
        pdf.close()
        return text.strip()

    if extension == ".docx":
        doc = Document(BytesIO(file_bytes))
        return "\n".join(p.text for p in doc.paragraphs).strip()

    if extension == ".md":
        return file_bytes.decode("utf-8").strip()

    raise HTTPException(status_code=400, detail="Unsupported file type.")

async def process_files(
    resume: UploadFile,
    job_description: UploadFile,
):
    resume_text = await extract_text(resume)
    jd_text = await extract_text(job_description)

    return resume_text, jd_text

@app.post("/analyze")
async def analyze(
    resume: UploadFile = File(...),
    job_description: UploadFile = File(...),
):
    resume_text, jd_text = await process_files(
        resume,
        job_description,
    )
    analysis = analyze_resume(resume_text, jd_text)
    return analysis.model_dump()
    
    
@app.get("/")
def home():
    return {"message": "Resume Parser API is running"}