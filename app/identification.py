import torch
import tensorflow as tf

import base64
from PIL import Image 
import io 
import datetime
import os 

import numpy as np
from sklearn.preprocessing import normalize
from sklearn.metrics import pairwise_distances

listImage = [
    {
        "img": 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        "title": 'Breakfast',
    },
    {
        "img": 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        "title": 'Burger',
    },
    {
        "img": 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
        "title": 'Camera',
    },
    {
        "img": 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
        "title": 'Coffee',
    },
    {
        "img": 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
        "title": 'Hats',
    },
    {
        "img": 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
        "title": 'Honey',
    },
    {
        "img": 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
        "title": 'Basketball',
    },
    {
        "img": 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
        "title": 'Fern',
    },
]

PATH_IMAGES = ''
PATH_FEATURES = './app/features'

def find(img_request, gallery_info, top):

    features_gallery = []
    labels_gallery = []
    path_gallery = []
    for feature in gallery_info:
        features_gallery.append(feature[0])
        labels_gallery.append(feature[1])
        path_gallery.append(os.path.join(PATH_IMAGES, os.path.basename(feature[2])))

    features_gallery = np.array(features_gallery)
    dis = pairwise_distances(img_request, features_gallery, metric='cosine')
    
    ind_max = np.argsort(dis, axis=1)[0, :int(top)]
    result = []
    for ind in ind_max:
        top_img = {
            'img': path_gallery[ind],
            'dis': str(dis[0][ind])
        }
        result.append(top_img)
    
    return result

def identification(img_url, model, trans, model_name, top):
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    #return list of image
    result = listImage
    time_start = datetime.datetime.now()

    img_bytes = base64.b64decode(img_url.split(',')[1])
    img = Image.open(io.BytesIO(img_bytes)).convert('RGB')

    if model_name == 'EIPNet':
        X_lr, RGB, Step1_edge, Step2_edge, Step3_edge, sess, model_extract = model
        img_lr = img.resize((112, 112))
        img_lr = np.expand_dims(img_lr, axis=0)
        img_sr, _, _, _ = sess.run([RGB, Step1_edge, Step2_edge, Step3_edge], feed_dict={X_lr: img_lr})
        print(img_sr.shape) # Value of img now is float
        img = Image.fromarray(img_sr[0].astype(np.uint8)) 

    img = trans(img)
    img = torch.unsqueeze(img, 0)
    if model_name == 'TCN':
        print(img.shape)
        out_net, _ = model(img.to(device))
        gallery_info = np.load(os.path.join(PATH_FEATURES, 'features_gallery_TCN.npy'), allow_pickle=True)
    else:
        out_net = model_extract(img.to(device))
        gallery_info = np.load(os.path.join(PATH_FEATURES, 'features_gallery_sr_EIPNet.npy'), allow_pickle=True)

    out_net = out_net.cpu().detach().numpy()
    list_path_top = find(out_net, gallery_info, top)
    
    time_inference = datetime.datetime.now() - time_start

    data = {
        'list_image': list_path_top,
        'time': str(time_inference.total_seconds())
    }

    return data, 0