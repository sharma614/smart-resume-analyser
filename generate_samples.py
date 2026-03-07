from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import os

def create_resume(filename, text_lines):
    filepath = os.path.join("d:\\New folder\\New folder\\smart-resume-analyzer", filename)
    c = canvas.Canvas(filepath, pagesize=letter)
    y = 750
    for line in text_lines:
        c.drawString(100, y, line)
        y -= 20
    c.save()
    print(f"Created {filename}")

# Resume 1: Good Match
text1 = [
    "Alex Software",
    "Frontend Engineer",
    "Experience:",
    "- Built web apps using React and Next.js",
    "- Styled components with Tailwind CSS",
    "- 6 years of experience using JavaScript and TypeScript",
    "- Deployed applications using Docker and AWS",
    "Education: B.S. Computer Science"
]

# Resume 2: Partial Match
text2 = [
    "Sam Developer",
    "Web Developer",
    "Experience:",
    "- 3 years experience with HTML, CSS, JavaScript",
    "- Started learning React recently",
    "- Familiar with Git and Linux",
    "- Built REST APIs using Node.js"
]

# Resume 3: Poor Match
text3 = [
    "Jordan Data",
    "Data Scientist",
    "Experience:",
    "- Python, Pandas, NumPy, Scikit-learn",
    "- Machine Learning models predicting customer churn",
    "- SQL and PostgreSQL databases",
    "- Data visualization with Matplotlib"
]

create_resume("sample_resume_good.pdf", text1)
create_resume("sample_resume_partial.pdf", text2)
create_resume("sample_resume_poor.pdf", text3)
