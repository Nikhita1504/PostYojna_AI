from flask import Flask, request, jsonify
from posb_model import POSBSchemePredictor
import traceback
from flask_cors import CORS

app = Flask(__name__)


CORS(app, 
     origins=["http://localhost:5173"], 
     methods=['GET', 'POST', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'])



predictor = POSBSchemePredictor()
predictor.data = predictor.generate_synthetic_data()
predictor.train_models(predictor.data)
predictor.save_model()

@app.route('/api/analyze', methods=['POST', 'OPTIONS'])
def analyze_district():

    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    
    try:
        data = request.json
        state = data.get('state')
        district_id = data.get('district_id')  

        if not state:
            return jsonify({'error': 'State is required'}), 400

        analysis = predictor.get_district_analysis(state, district_id)
        return jsonify(analysis)

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=6000, host='0.0.0.0')