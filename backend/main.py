from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv
import nlp_utils

load_dotenv()

app = FastAPI(title="Smart Resume Analyzer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisResult(BaseModel):
    ats_score: float
    skills: Dict[str, List[str]]
    missing_keywords: List[str]
    suggestions: List[str]

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_resume(file: UploadFile = File(...), job_description: str = Form(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    # Read PDF bytes
    file_bytes = await file.read()
    
    resume_text = nlp_utils.extract_text_from_pdf(file_bytes)
    resume_skills = nlp_utils.extract_skills_with_categories(resume_text)
    
    jd_skills = nlp_utils.extract_skills_with_categories(job_description)
    
    ats_score = nlp_utils.compute_similarity(resume_text, job_description)
    missing_kws = nlp_utils.extract_missing_keywords(resume_skills, jd_skills)
    
    suggestions = []
    if missing_kws:
        suggestions.append(f"Consider adding skills like {', '.join(missing_kws[:3])} to match the job description.")
    if ats_score < 70:
        suggestions.append("Your resume could use more alignment with the job description keywords.")
        
    return AnalysisResult(
        ats_score=ats_score,
        skills=resume_skills,
        missing_keywords=missing_kws,
        suggestions=suggestions
    )

@app.post("/report")
async def generate_report(result: AnalysisResult):
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import letter
    import io
    from fastapi.responses import StreamingResponse

    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    c.drawString(100, 750, "Resume Analysis Report")
    c.drawString(100, 730, f"ATS Match Score: {result.ats_score}%")
    
    c.drawString(100, 700, "Missing Skills:")
    y = 680
    for missing in result.missing_keywords[:10]:
        c.drawString(120, y, f"- {missing}")
        y -= 20
        
    c.showPage()
    c.save()
    buffer.seek(0)
    
    return StreamingResponse(
        buffer, 
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=report.pdf"}
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
