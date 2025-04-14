from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from model import answer_question, solve_math  # ✅ Import functions from model.py
from flask_cors import CORS  # Allow cross-origin requests

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)  # Enable CORS for frontend API calls

# ✅ Set a SECRET KEY (required for session handling)
app.secret_key = "your_super_secret_key"  # 🔹 Change this to a random string

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")

@app.route("/model")
def model_page():
    return render_template("model.html")

@app.route("/logout")
def logout():
    session.clear()  # Clears session data
    return redirect(url_for("home"))

@app.route('/get_answer', methods=['POST'])  # Rename /ask to /get_answer
def get_answer():
    """Handle question-answering API requests."""
    data = request.get_json()
    if not data or "question" not in data:
        return jsonify({"error": "The 'question' field is required"}), 400

    question = data["question"]
    context = data.get("context", None)  # Make context optional

    try:
        if any(op in question.lower() for op in ["+", "-", "*", "/", "multiplied", "divided", "plus", "minus"]):
            answer = solve_math(question)  # Solve math question
        else:
            answer = answer_question(question, context)  # Use Gemini model

        return jsonify({"answer": answer})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
