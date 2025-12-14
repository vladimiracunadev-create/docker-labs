from flask import Flask, jsonify
from datetime import datetime

app = Flask(__name__)

@app.get("/")
def home():
    return "Python OK ✅"

@app.get("/health")
def health():
    return jsonify(ok=True, ts=datetime.utcnow().isoformat() + "Z")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
