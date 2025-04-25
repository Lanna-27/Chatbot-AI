# backend/app.py
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv

load_dotenv()  # Carga variables de .env

app = Flask(__name__)
CORS(app)  # Habilita CORS

BEARER_TOKEN = os.getenv("BEARER_TOKEN")
API_URL = "https://api.deepseek.com/v1/chat/completions"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat_with_deepseek():
    try:
        data = request.json
        print(f"Received data: {data}")  # Debugging line
        headers = {
            "Authorization": f"Bearer {BEARER_TOKEN}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "deepseek",
            "messages": data["messages"],
            "stream": False
        }
        print(data["messages"])  # Debugging line

        response = requests.post(API_URL, json=payload, headers=headers)
        return jsonify(response.json()), response.status_code
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)