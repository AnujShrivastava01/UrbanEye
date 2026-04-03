from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import datetime

app = Flask(__name__)
CORS(app)

# Dummy state for the issues
issues = [
    {
        "id": 1,
        "title": "Large Pothole on Main St",
        "category": "road",
        "description": "Deep pothole causing traffic slowdown.",
        "status": "reported",
        "location": "Main St & 4th Ave",
        "timestamp": "2026-04-01T10:00:00Z",
        "ai_prediction": "High risk of vehicle damage. Prioritize repair."
    },
    {
        "id": 2,
        "title": "Broken Streetlight",
        "category": "utility",
        "description": "Streetlight has been out for 3 days.",
        "status": "investigating",
        "location": "Oakwood Drive",
        "timestamp": "2026-04-02T18:30:00Z",
        "ai_prediction": "Area crime risk elevated due to low visibility."
    }
]

@app.route('/api/issues', methods=['GET'])
def get_issues():
    return jsonify(issues)

@app.route('/api/issues', methods=['POST'])
def report_issue():
    data = request.json
    new_issue = {
        "id": len(issues) + 1,
        "title": data.get("title"),
        "category": data.get("category", "other"),
        "description": data.get("description"),
        "status": "reported",
        "location": data.get("location"),
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "ai_prediction": _mock_ai_analysis(data.get("category"))
    }
    issues.append(new_issue)
    return jsonify({"message": "Issue reported successfully", "issue": new_issue}), 201

def _mock_ai_analysis(category):
    if category == "road":
        return "Pattern matches severe infrastructure decay. Urgent attention recommended."
    elif category == "utility":
        return "Possible grid failure detected in the sector. Dispatch maintenance crew."
    elif category == "sanitation":
        return "Historical data indicates this area has chronic sanitation alerts."
    return "Issue analyzed by UrbanAI. Prioritized according to standard protocol."

if __name__ == '__main__':
    app.run(debug=True, port=5000)
