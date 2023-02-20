import sys
sys.path.insert(0, './app/EIPnet')
sys.path.insert(1, './app')
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

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def subtract_mean(x):
    mean_vector = [91.4953, 103.8827, 131.0912]
    x *= 255.
    x[0] -= mean_vector[0]
    x[1] -= mean_vector[1]
    x[2] -= mean_vector[2]
    return x

def fixed_image_standardization(image_tensor):
    processed_tensor = (image_tensor - 127.5) / 128.0
    return processed_tensor

def load_model_TCN():
    model = torch.load('./app/pretrained/TCN_InceptionV1.pt')
    model.to(device)
    model.eval()

    trans = T.Compose([
                T.Resize((224, 224)),
                T.ToTensor(),
                T.Lambda(lambda x: subtract_mean(x))
            ])

    return model, trans

def load_model_EIPNet(batch=2):
    opt = TestOptions().parse()
    checkpoint_path = opt.weight_path
    X_lr = tf.placeholder(tf.float32, shape=[batch, 112, 112, opt.output_nc])
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
    
    return (X_lr, RGB, Step1_edge, Step2_edge, Step3_edge, sess, model), trans
       