install:
	pip install -r requirements.txt
	# instal torch==1.4.0+cpu
	pip install torch==1.4.0+cpu torchvision==0.5.0+cpu -f https://download.pytorch.org/whl/torch_stable.html 
	# instal sklearn
	pip install -U scikit-learn

download:
	# download pretrained TCN 
	gdown https://drive.google.com/u/1/uc?id=1ZGaHazJYlc00pS0CzrcrQfS07km6yZ6X&export=download
	