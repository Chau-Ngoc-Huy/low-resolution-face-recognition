def verification(img1, img2, model):
    req = {
        "image1": img1,
        "image2": img2,
        "model": model
    }
    acc = 0.9
    time = 1
    return req, acc, time