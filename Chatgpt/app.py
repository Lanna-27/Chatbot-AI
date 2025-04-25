from flask import Flask, render_template, request, jsonify
import requests
import os

app = Flask(__name__)

# Configura tu clave de API de OpenAI
API_KEY = "TU_API_KEY"
API_URL = "https://api.openai.com/v1/chat/completions"

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        user_input = request.form.get("user_input")
        response = get_chatgpt_response(user_input)
        return render_template("index.html", user_input=user_input, response=response)
    return render_template("index.html")


def get_chatgpt_response(prompt):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "gpt-4",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 200
    }

    try:
        response = requests.post(API_URL, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"].strip()
    except Exception as e:
        return f"Error al conectar con la API: {str(e)}"


if __name__ == "__main__":
    app.run(debug=True)
