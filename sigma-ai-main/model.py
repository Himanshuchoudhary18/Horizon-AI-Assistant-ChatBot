import google.generativeai as genai
import sympy as sp

# ✅ Configure Gemini API (Replace with your actual API key)
genai.configure(api_key="AIzaSyCm7T7zNyfETa6_dcOkfGGto3SEeYjKMeE")

def answer_question(question, context=None):
    """Use Google Gemini to answer questions with or without context."""
    model = genai.GenerativeModel("gemini-1.5-pro-latest")  # Choose appropriate Gemini model

    if context:
        prompt = f"Based on the following context, answer the question:\n\nContext: {context}\n\nQuestion: {question}"
    else:
        prompt = f"Answer the following question: {question}"

    response = model.generate_content(prompt)
    return response.text.strip() if response else "I couldn't find an answer."

def solve_math(question):
    """Detect and solve basic math expressions."""
    try:
        expression = (
            question.replace("What is", "")
            .replace("Calculate", "")
            .replace("?", "")
            .replace("multiplied by", "*")
            .replace("divided by", "/")
            .replace("add", "+")
            .replace("minus", "-")
            .strip()
        )
        result = sp.sympify(expression)  # Compute result using SymPy
        return str(result)
    except Exception as e:
        return f"Error: {str(e)}"
