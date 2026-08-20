from google import genai
import os


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def extract_paper(text):

    prompt = f"""
You are a research analyst.

Analyze this academic paper and extract:

- Research question
- Dataset
- Methodology
- Model/approach
- Results
- Limitations

Paper:
{text}
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt
    )

    return response.text