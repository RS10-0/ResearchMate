from google import genai
import os


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def find_gaps(text):

    prompt = f"""
You are a research strategist.

Analyze this academic paper:

{text}

Find:

- Research gaps
- Future research opportunities
- Possible experiments
- New directions researchers could explore
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt
    )

    return response.text