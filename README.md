# Smart Resume Analyzer

A full-stack AI-powered Resume Analyzer built to help candidates parse resumes, compute an ATS (Applicant Tracking System) compatibility score, and match skills against specific job descriptions. 

This project uses **PyMuPDF** for text extraction, **spaCy** for NLP tokenization/lemmatization, and **scikit-learn** (TF-IDF + Cosine Similarity) to calculate an ATS match score. The frontend is a modern, dark-themed React application styled with **Tailwind CSS**, featuring an interactive radar chart built with **Plotly** to visualize skill gaps.

![Smart Resume Analyzer](https://img.shields.io/badge/Status-Active-brightgreen.svg)
![Python](https://img.shields.io/badge/Backend-FastAPI-blue)
![React](https://img.shields.io/badge/Frontend-React%2BVite-61DAFB)

---

## Features

- **Drag-and-Drop Resume Upload**: Upload any PDF resume directly to the UI.
- **Smart Skill Extraction**: Maps extracted text to a predefined database of hundreds of technical skills (Languages, Frameworks, Cloud, Databases, Data Science).
- **ATS Compatibility Scoring**: Uses TF-IDF cosine similarity to score the resume against the job description.
- **Skill Gap Analysis Radar Chart**: Visualizes exactly where the candidate's skills meet or fall short of the job requirements.
- **Actionable Feedback**: Identifies critical missing keywords and provides suggestions on how to improve the resume.
- **Downloadable Reports**: Generates a clean, professional PDF report of the analysis using ReportLab.

---

## Project Structure

```text
smart-resume-analyzer/
│
├── backend/                   # FastAPI Backend
│   ├── main.py                # Main FastAPI application and API routes (/analyze, /report)
│   ├── nlp_utils.py           # NLP logic (PDF extraction, spaCy processing, Similarity scoring)
│   ├── requirements.txt       # Python dependencies
│   └── skills_db.json         # Predefined categorized technical skills dictionary
│
├── frontend/                  # React + Vite Frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        
│   │   │   └── Dashboard.jsx  # Results dashboard containing the Plotly radar chart and ATS score
│   │   ├── App.jsx            # Main app layout, dropzone, and API integration
│   │   ├── index.css          # base Tailwind CSS (v4) styles
│   │   └── main.jsx           # React entry point
│   ├── package.json           # Node.js dependencies
│   ├── postcss.config.js      # PostCSS configuration for Tailwind CSS v4
│   └── tailwind.config.js     # Tailwind configuration file
│
├── generate_samples.py        # Helper script to generate mock PDF resumes for testing
└── sample_jd.txt              # A sample job description for testing the pipeline
```

---

## Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup
Navigate to the backend directory, set up a virtual environment, and install the dependencies:
```bash
cd backend
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\activate
# Activate virtual environment (Mac/Linux)
source venv/bin/activate

# Install requirements
pip install -r requirements.txt

# Download the spaCy English model
python -m spacy download en_core_web_sm

# Start the FastAPI server
python main.py
```
The backend will run on `http://localhost:8000`.

### 2. Frontend Setup
Navigate to the frontend directory and install the Node modules:
```bash
cd frontend
npm install

# Start the Vite development server
npm run dev
```
The frontend will run on `http://localhost:5173`.

---

## Usage
1. Make sure both the backend and frontend servers are running.
2. Open `http://localhost:5173` in your browser.
3. Paste a Job Description (e.g., from `sample_jd.txt`) into the text area.
4. Drag and drop a PDF resume (you can generate sample resumes by running `python generate_samples.py` in the root directory).
5. Click **Analyze Resume** and review the interactive dashboard!
6. Click **Download PDF Report** to export the ATS match results.

## Technologies Used
- **Backend:** Python, FastAPI, PyMuPDF, spaCy, scikit-learn, ReportLab
- **Frontend:** React, Vite, Tailwind CSS (v4), react-dropzone, react-plotly.js, axios
