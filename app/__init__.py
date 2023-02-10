# from asyncio.constants import ACCEPT_RETRY_DELAY
from unittest import result
from flask import Flask, send_file, jsonify, request
from app.identification import identification
from app.verificaiton import verification
from flask_cors import CORS

from app.utils import load_model_EIPNet, load_model_TCN

# from app import extract_vector

# extract_vector.init()

models = ['TCN', 'EIPNet']
 
app = Flask(__name__,
            static_url_path='/',
            static_folder='build')
CORS(app)

model_TCN, trans_TCN = load_model_TCN()
model_EIPNet, trans_EIPNet = load_model_EIPNet()

@app.route('/')
def index():
    return send_file('build/index.html')

@app.route('/api/verification/<model_id>', methods=['POST'])
def verified(model_id):
    print('-------------------')
    model = models[int(model_id)]
    if request.is_json:
        if model == 'TCN':
            model_use = model_TCN
            trans = trans_TCN
        else:
            model_use = model_EIPNet
            trans = trans_EIPNet

        req, acc, time = verification(request.get_json()['image1'], request.get_json()['image2'], model_use, trans, model)
        res = jsonify({
            'req': req,
            'acc': acc,
            'time': time
        })
        return res
    else:
        return jsonify({'message': 'bad request'}), 400

@app.route('/api/identification/<model_id>', methods=['POST'])
def identified(model_id):

    offset = request.args.get('offset')
    print(model_id)
    model = models[int(model_id)]
    if request.is_json:
        if model == 'TCN':
            model_use = model_TCN
            trans = trans_TCN
        else:
            model_EIPNet, trans_EIPNet = load_model_EIPNet(batch=1)
            model_use = model_EIPNet
            trans = trans_EIPNet

        result, time = identification(request.get_json()['image1'], model_use, trans, model, offset)

        res = jsonify({
            'result': result,
            'time': time
        })
        return res
    else:
        return jsonify({'message': 'bad request'}), 400
