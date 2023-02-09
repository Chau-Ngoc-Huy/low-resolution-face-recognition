import sys
sys.path.insert(0, './app/EIPnet')

import torch
from facenet_pytorch import InceptionResnetV1
import torchvision.transforms as T

import tensorflow as tf
from networks import generator
from options.test_options import TestOptions

import base64
from PIL import Image 
import cv2
import io 
import os 

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
def verification(img1, img2, model_type):
    req = {
        "image1": img1,
        "image2": img2,
        "model": model_type
    }

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    img1 = base64.b64decode(img1.split(',')[1])
    img1 = Image.open(io.BytesIO(img1)).convert('RGB')    
    img2 = base64.b64decode(img2.split(',')[1])
    img2 = Image.open(io.BytesIO(img2)).convert('RGB')

    if model_type == 'TCN':
        model = torch.load('./app/pretrained/TCN_InceptionV1.pt')
        model.to(device)
        model.eval()

        trans = T.Compose([
                    T.Resize(224),
                    T.ToTensor(),
                    T.Lambda(lambda x: subtract_mean(x))
                ])

    elif model_type == 'EIPNet':
        opt = TestOptions().parse()
        checkpoint_path = opt.weight_path
        X_lr = tf.placeholder(tf.float32, shape=[2, 112, 112, opt.output_nc])
        X_hr = tf.placeholder(tf.float32, shape=[1, 112, 112, opt.output_nc])

        training = False

        config = tf.ConfigProto()
        # config.gpu_options.allow_growth = True
        # config.gpu_options.visible_device_list = opt.gpu_ids

        RGB, Step1_edge, Step2_edge, Step3_edge = generator(X_lr)

        sess = tf.Session(config=config)
        sess.run(tf.global_variables_initializer())
        saver = tf.train.Saver(max_to_keep=None)
        save_file = os.path.join(checkpoint_path, 'G_weight.ckpt')
        saver.restore(sess, save_file)
        
        model =  InceptionResnetV1(pretrained='vggface2')
        model.to(device)
        model.eval()

        trans = T.Compose([
                    T.Resize(160),
                    np.float32,          #Value not normalized when toTensor
                    T.ToTensor(),
                    fixed_image_standardization
                ])
   
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

    if model_type == 'TCN':
        out_net, _ = model(imgs.to(device))
        print('-------')
    else:
        out_net = model(imgs.to(device))

    embeddings = out_net.detach().cpu().numpy()
    embeddings = normalize(embeddings)

    diff = np.subtract(embeddings[0], embeddings[1])
    dist = np.sum(np.square(diff))
    print('Distance between embeddings: ', dist)
    if dist < 0.5: 
        pair = 1
    else:
        pair = 0 
    
    return req, pair, 1