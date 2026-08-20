from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import pymupdf

from agents.analyzer import analyze_paper


app = FastAPI(
    title="ResearchMate AI",
    description="AI-powered research assistant using Gemini"
)


# ---------------------------------
# Allow React frontend connection
# ---------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def home():
    return {
        "message": "ResearchMate AI is running 🚀"
    }



@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):

    # -----------------------------
    # 1. Validate file
    # -----------------------------

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )


    # -----------------------------
    # 2. Read PDF
    # -----------------------------

    pdf_bytes = await file.read()

    print("FILE:", file.filename)
    print("CONTENT TYPE:", file.content_type)
    print("PDF SIZE:", len(pdf_bytes))


    if len(pdf_bytes) == 0:
        raise HTTPException(
            status_code=400,
            detail="Uploaded PDF is empty"
        )


    # -----------------------------
    # 3. Extract PDF text
    # -----------------------------

    try:

        with open("uploaded.pdf", "wb") as f:
            f.write(pdf_bytes)


        document = pymupdf.open("uploaded.pdf")

        text = ""

        for page in document:
            text += page.get_text()


        document.close()


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"PDF extraction failed: {str(e)}"
        )



    if not text.strip():

        raise HTTPException(
            status_code=400,
            detail="Could not extract text from PDF"
        )


    print(
        "EXTRACTED CHARACTERS:",
        len(text)
    )


    # --------------------------------
    # Limit Gemini token usage
    # --------------------------------

    text = text[:50000]



    # -----------------------------
    # 4. Gemini Analysis
    # -----------------------------

    try:

        report = analyze_paper(text)


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"AI processing failed: {str(e)}"
        )



    # -----------------------------
    # 5. Return result
    # -----------------------------

    return {

        "filename": file.filename,

        "analysis": report

    }