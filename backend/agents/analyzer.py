from google import genai
import os
import json


client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)



def clean_json(text):

    """
    Removes markdown formatting if Gemini adds it
    """

    text = text.strip()

    if "```json" in text:
        text = text.replace("```json", "")

    if "```" in text:
        text = text.replace("```", "")

    return text.strip()





def analyze_paper(text):


    # Prevent huge prompts
    text = text[:50000]


    prompt = f"""

You are ResearchMate AI, an expert academic research assistant.

Analyze this research paper.

You MUST return ONLY valid JSON.
No explanation.
No markdown.
No ```.

Follow this exact structure:


{{
"research_summary": "",

"research_question": "",

"dataset": "",


"methodology": [
"Step 1",
"Step 2",
"Step 3"
],


"results": [
"Finding 1",
"Finding 2"
],


"strengths": [
"Strength 1",
"Strength 2"
],


"weaknesses": [
"Weakness 1",
"Weakness 2"
],


"research_gaps": [
"Gap 1",
"Gap 2"
],


"future_experiments": [
"Experiment 1",
"Experiment 2"
]

}}



Formatting requirements:

- methodology MUST be a chronological list of steps.
- Each methodology step should describe one action.
- Do not number steps.
- results MUST be separate findings.
- strengths and weaknesses MUST be separate bullet points.
- research gaps MUST be individual points.
- future experiments MUST be actionable suggestions.
- Avoid combining multiple ideas into one item.


Research Paper:

{text}

"""


    try:


        response = client.models.generate_content(

            model="gemini-3.6-flash",

            contents=prompt

        )


        raw=response.text


        cleaned=clean_json(raw)



        parsed=json.loads(cleaned)


        return json.dumps(parsed)



    except Exception as e:


        print("\n========== GEMINI ERROR ==========")
        print(e)

        print("\nRAW RESPONSE:")
        try:
            print(response.text)
        except:
            pass

        print("==================================\n")


        raise Exception(
            f"Gemini processing failed: {str(e)}"
        )