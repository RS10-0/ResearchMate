from google import genai
import os


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def review_paper(text):

    prompt = f"""
You are a scientific peer reviewer.

Analyze this academic paper:

{text}

Identify:

- Strengths
- Weaknesses
- Possible biases
- Missing experiments
- Suggestions for improvement
- Overall evaluation of the research quality
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt
    )

    return response.text