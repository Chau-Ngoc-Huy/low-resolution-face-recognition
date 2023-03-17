import torch
import tensorflow as tf

import base64
from PIL import Image 
import io 
import datetime 

import numpy as np
from sklearn.preprocessing import normalize

def fixed_image_standardization(image_tensor):
    processed_tensor = (image_tensor - 127.5) / 128.0
    return processed_tensor

def subtract_mean(x):
    mean_vector = [91.4953, 103.8827, 131.0912]
    x *= 255.
    x[0] -= mean_vector[0]
    x[1] -= mean_vector[1]
    x[2] -= mean_vector[2]
    return x

@torch.no_grad()
def verification(img1, img2, model, trans, model_name):
    req = {
        "image1": img1,
        "image2": img2,
        "model": model_name
    }

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    time_start = datetime.datetime.now()

    img1 = base64.b64decode(img1.split(',')[1])
    img1 = Image.open(io.BytesIO(img1)).convert('RGB')    
    img2 = base64.b64decode(img2.split(',')[1])
    img2 = Image.open(io.BytesIO(img2)).convert('RGB')

    if model_name == 'EIPNet':
       
        X_lr, RGB, Step1_edge, Step2_edge, Step3_edge, sess, model_extract = model
        img1 = img1.resize((112, 112))
        img2 = img2.resize((112, 112))
        img_lr = np.stack((img1, img2), axis=0)
        img_sr, _, _, _ = sess.run([RGB, Step1_edge, Step2_edge, Step3_edge], feed_dict={X_lr: img_lr})
        print(img_sr.shape) # Value of img now is float
        img1 = Image.fromarray(img_sr[0].astype(np.uint8)) 
        img2 = Image.fromarray(img_sr[1].astype(np.uint8))
        
    img1 = trans(img1)
    img2 = trans(img2)
    imgs = torch.stack((img1, img2), 0)
    print(imgs.shape)

    if model_name == 'TCN':
        out_net, _ = model(imgs.to(device))
    else:
        out_net = model_extract(imgs.to(device))

    embeddings = out_net.detach().cpu().numpy()
    embeddings = normalize(embeddings)

    diff = np.subtract(embeddings[0], embeddings[1])
    dist = np.sum(np.square(diff))
    print('Distance between embeddings: ', dist)
    if dist < 0.5: 
        pair = 'true'
    else:
        pair = 'false'
    
    time_inference = datetime.datetime.now() - time_start

    data = {
        'distance': str(dist),
        'result': pair,
        'time': str(time_inference.total_seconds())
    }
    
    return data, 0