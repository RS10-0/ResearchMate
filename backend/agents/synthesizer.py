from google import genai
import os


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def synthesize(extraction, review, gaps):

    prompt = f"""
You are an expert research assistant.

Create a professional research briefing using the analysis below.

Paper Extraction:
{extraction}

Peer Review:
{review}

Research Gaps:
{gaps}

Format the final report with these sections:

1. Research Summary
2. Methodology Analysis
3. Strengths and Weaknesses
4. Research Gaps
5. Future Research Opportunities
6. Suggested Experiments

Make it detailed, clear, and useful for researchers.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents=prompt
    )

    return response.text