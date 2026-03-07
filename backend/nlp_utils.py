import fitz  # PyMuPDF
import spacy
import json
import os
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Load skills DB
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(BASE_DIR, "skills_db.json"), "r") as f:
    SKILLS_DB = json.load(f)

# Flatten skills for quick lookup, mapping skill -> category
SKILL_TO_CATEGORY = {}
for category, skills in SKILLS_DB.items():
    for skill in skills:
        SKILL_TO_CATEGORY[skill.lower()] = category

def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text

def extract_skills_with_categories(text: str) -> dict:
    """Extract skills from text and map them to their categories."""
    doc = nlp(text.lower())
    text_lower = text.lower()
    
    found_skills = {}
    
    # Check all known skills in the text
    for skill, category in SKILL_TO_CATEGORY.items():
        # Match whole words to avoid partial matches
        pattern = r'\b' + re.escape(skill) + r'\b'
        # Special case for c++ or c# where \b might not match gracefully
        if skill in ('c++', 'c#'):
            pattern = re.escape(skill)
            
        if re.search(pattern, text_lower):
            if category not in found_skills:
                found_skills[category] = []
            if skill not in found_skills[category]:
                found_skills[category].append(skill)
                    
    return found_skills

def compute_similarity(resume_text: str, jd_text: str) -> float:
    """Compute cosine similarity between resume and JD using TF-IDF."""
    if not resume_text.strip() or not jd_text.strip():
        return 0.0
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
    similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
    return round(float(similarity[0][0]) * 100, 2)

def extract_missing_keywords(resume_skills: dict, required_skills: dict) -> list:
    """Find skills present in required_skills but not in resume_skills."""
    missing = []
    for category, skills in required_skills.items():
        res_skills = resume_skills.get(category, [])
        for skill in skills:
            if skill not in res_skills:
                missing.append(skill)
    return missing
