import base64
import cv2
import numpy as np

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

def identification(img_url, model, number):
    #return list of image
    result = listImage
    time = 0.1
    img_bytes = base64.b64decode(img_url.split(',')[1])
    img_file = open('./image.jpeg', 'wb')
    img_file.write(img_bytes)
    print(img_bytes)
    return result, time