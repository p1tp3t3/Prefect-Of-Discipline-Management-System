from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from webpush import WebPush
from model_training.config_model import model_eivp

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')



#------------------------------------------Model Routes-------------------------------------------
"""
@app.route('/python/violation/add', methods=['POST'])
def add_violation():
    data = request.get_json()
    if not data or 'violation' not in data:
        return jsonify({"status": "error", "message": "Invalid payload"}), 400
    
    model_cca.add_violation(data['id'], data['violation'])
        
    return jsonify({
        'status': 'success',
        'message': 'Violation added successfully'
    })

@app.route('/python/violation/delete', methods=['POST'])
def delete_violation():
    data = request.get_json()
    if not data or 'id' not in data:
        return jsonify({"status": "error", "message": "Invalid payload"}), 400
    
    model_cca.delete_violation(data['id'])
        
    return jsonify({
        'status': 'success',
        'message': 'Violation deleted successfully'
    })

@app.route('/python/complaint/context', methods=['POST'])
def analyze_complaint_context():
    data = request.get_json()
    if not data or 'complaint_text' not in data:
        return jsonify({"status": "error", "message": "Invalid payload"}), 400

    complaint_text = data['complaint_text']
    results = model_cca.analyze(complaint_text)
    
    return jsonify({
        'data': results
    })
"""
@app.route('/python/model/data/append', methods=['POST'])
def append_logistic_test_data():
    data = request.get_json()
    
    model_eivp.append(data)
    model_eivp.train_model(True)
        
    return jsonify({
        'status': 'success',
        'message': 'Test data appended successfully'
    })

@app.route('/python/model/predict', methods=['POST'])
def incident_risk():
    data = request.get_json()
    print(data)
    
    pred = model_eivp.predict(data)
    insight = model_eivp.get_insights(data, pred)
    reco = model_eivp.get_recommendation(data, pred)
    
        
    return jsonify({
        'prediction': pred,
        'insights': insight,
        'reco': reco
    })
    
#------------------------------------------------------------------------------------------------------


#------------------------------------------------------------------------------------------------------
#------------------------------------------------------------------------------------------------------


#------------------------------------------Push Notification Route-------------------------------------------
    
@app.route('/python/webpush', methods=['POST'])
def push_notification():
    json_data = request.get_json()
    data = {
        'title': json_data.get('title'),
        'body': json_data.get('body'),
        'icon': json_data.get('icon'),
        'url': json_data.get('url')
    }
    errors = []
    sub = json_data.get('subscription')
    
    for s in sub:
        wp = WebPush(data, s['endpoint'], s['public_key'], s['auth'])
        errors.append(wp.push())
    
    print(errors)
    return jsonify({'status': 'success', 'message': 'Data received', 'errors': errors }) 


@app.route('/python/webpush/check-subscription-expiration', methods=['POST'])
def check_expiration():
    data = request.get_json()
    if not data or "list" not in data:
        return jsonify({
            "status": "error",
            "message": "Missing 'list'"
        }), 400

    endpoints = data["list"]
    print(endpoints)
    results = []

    for item in endpoints:
        endpoint = item.get("endpoint")
        p256dh = item.get("public_key")
        auth = item.get("auth")

        if not endpoint or not p256dh or not auth:
            results.append({
                "endpoint": endpoint,
                "status": "invalid",
                "message": "Missing subscription keys"
            })
            continue

        # Instance of WebPush for this record
        wp = WebPush(
            data={"title": "", "body": "", "icon": "", "url": ""},
            endpoint=endpoint,
            public_key=p256dh,
            auth=auth
        )

        # Check expiration
        result = wp.check_expired_subscription(endpoint)
        results.append(result)
        
        print(result)
    return jsonify({
        "status": "success",
        "results": results
    })
    
#------------------------------------------------------------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True, port=5032)