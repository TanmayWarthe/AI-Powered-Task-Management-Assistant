from flask import Flask, request, jsonify
from flask_cors import CORS
from nlp_parser import parse_natural_language
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "AI Service Running", "version": "1.0"})

@app.route('/parse-task', methods=['POST'])
def parse_task():
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({"error": "No text provided"}), 400
        
        # NLP parsing call karo
        result = parse_natural_language(text)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('AI_SERVICE_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)