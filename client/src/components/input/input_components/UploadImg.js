import React, { useState, useRef, useEffect } from 'react'
import Slider from '@mui/material/Slider';
import { useDropzone } from 'react-dropzone';
import ReactCrop, {
	centerCrop,
	makeAspectCrop,
} from 'react-image-crop'

import { CanvasPreview } from './CanvasPreview'
import ShowWebCam from './ShowWebCam';
// import Resize from './Resize';


function centerAspectCrop() {
    let mediaWidth = 64;
    let mediaHeight = 64;
    let aspect = 1 / 1;
    return centerCrop(
      makeAspectCrop(
        {
          unit: 'px',
          width: 64,
        },
        aspect,
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    )
  }
function UploadImg({setImg, labelName, type='upload-image'}) {
    const [imgSrc, setImgSrc] = useState('')
    const [files, setFiles] = useState([]);
    const [fileName, setFileName] = useState("")
    const [crop, setCrop] = useState({})
    const [completedCrop, setCompletedCrop] = useState({})
	const [isCompletedCrop, setIsCompletedCrop] = useState(false)
    const [scale, setScale] = useState(1)
	// const [isDrawing, setIsDrawing] = useState(false)
    const [rotate, setRotate] = useState(0)
    const drawCanvasRef = useRef(null);
    const contextRef = useRef(null);
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null)
    const aspect = 1 / 1
	const size = 384

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
          'image/*': []
        },
        onDrop: acceptedFiles => {
          setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
          })));
        }
      });
    const onImageLoad = (e) => {
        if (aspect) {
          const { width, height } = e.currentTarget
          setCrop(centerAspectCrop(width, height, aspect))
    
        }
    }

    useEffect(() => {
        files.map(file => {
          setFileName(file.path)
          return setImgSrc(file.preview)
        })
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
      }, [files]);
    
      
    
    useEffect(() => {
        const t = setTimeout(async () => {
			if (
				completedCrop?.width &&
				completedCrop?.height &&
				imgRef.current &&
				previewCanvasRef.current
			) {
				CanvasPreview(
					imgRef.current,
					previewCanvasRef.current,
					completedCrop,
					scale,
					rotate,
				)
				// console.log(completedCrop)
				// console.log(previewCanvasRef.current.toDataURL())
				setImg(previewCanvasRef.current.toDataURL())
			}
        }, 100)
        return () => {
          clearTimeout(t)
        }
    }, [completedCrop, scale, rotate, previewCanvasRef])

	const handleRemoveFile = () => {
        setImgSrc("")
        setFileName("")
        setFiles([])
        setImg(null)
		setIsCompletedCrop(false)
        const canvas = previewCanvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    useEffect(() => {
		if (drawCanvasRef.current !== null) {
			const canvas = drawCanvasRef.current
			canvas.width = size;
			canvas.height = size;
		
			const context = canvas.getContext("2d")
			context.scale(1, 1);
			context.lineCap = "round";
			context.strokeStyle = "black";
			context.lineWidth = 5;
			contextRef.current = context;
		}
        
      }, [drawCanvasRef]);

    return (
        <div className={type}>
			<div className='input-image table'>
				<ShowWebCam setImgSrc={setImgSrc} imgSrc={imgSrc} setFileName={setFileName} files={files}></ShowWebCam>
				<div className="crop-controls float-left">
					<label className='label-dropzone label'>{labelName}</label>
					<div className='drop-file'>
						<div className='dropzone-container'>
							<div {...getRootProps()} className="dropzone">
								<input {...getInputProps()} />
								<span><i className="fa-sharp fa-solid fa-upload"></i></span>
								<p>Drop a file or click to select</p>
								<p>{ }</p>
							</div>
							{!!fileName && <div className='filename-container'>
								<p>{fileName}</p>
								<i className="fa-solid fa-trash" onClick={handleRemoveFile}></i>
							</div>}
						</div>
					</div>
				</div>
				
				
			</div>
            
			<div className='show-img'>
				
				<div className='preview-image table'>
					{!!imgSrc && <>
						<div className='modal-container'>
						<label className='label-mask label'>Origin</label>
							{
							<ReactCrop
								style={{ display:'block', width: 'fit-content'}}
								crop={crop}
								onChange={(_, percentCrop) => setCrop(percentCrop)}
								onComplete={(c) => {
									setCompletedCrop(c)
									setIsCompletedCrop(true)
								}}
								aspect={aspect}
							>
								
								{imgSrc &&<img
									ref={imgRef}
									alt="Crop me"
									src={imgSrc}
									style={{ 
										transform: `scale(${scale}) rotate(${rotate}deg)`,
										maxHeight: size,
										minHeight: '300px',
										maxWidth: '600px',
										// maxHeight: '600px',
										
									}}
									onLoad={onImageLoad}
								/>}
							</ReactCrop>}
						</div>
					</>}
					{isCompletedCrop && (
					<div className='draw-mask'>
						<label className='label-mask label'>Preview</label>
						<div style={{ position: "relative" }}>
							<canvas
								id='canvas'
								ref={previewCanvasRef}
								style={{
									border: '1px solid black',
									objectFit: 'contain',
									width: size,
									height: size,
									// position: 'relative'
								}}
							></canvas>
							<canvas
								// onMouseDown={startDrawing}
								// onMouseUp={finishDrawing}
								// onMouseMove={draw}
								ref={drawCanvasRef}
								style={{ position: "absolute", top: "0" }}
							></canvas>
						</div>
					</div>
					
					)}
				
					{/* {!!imgSrc && <div>
					<label className='edit-label label'>edit</label>
						<div className='modal'>
							<div className='settings-image'>
								<div className='zoom-container'>
									<span className='icon' onClick={() => setScale((current) => current - 0.1)}><i className="fa-sharp fa-solid fa-magnifying-glass-minus"></i></span>
									<Slider
										aria-label="Default"
										valueLabelDisplay="auto"
										min={0}
										max={200}
										value={typeof scale === 'number' ? Math.round(scale * 100) : 0}
										onChange={(e, newValue) => setScale(newValue / 100)}
									/>
									<span className='icon' onClick={() => setScale((current) => current + 0.1)}><i className="fa-sharp fa-solid fa-magnifying-glass-plus"></i></span>
								</div>
								<div className='rotate-container'>
									<div className='rotate-btn' onClick={() => setRotate(current => current - 90)}>
										<button>Rotale left</button>
										<span><i className="fa-sharp fa-solid fa-rotate-left"></i></span>
									</div>
									<div className='rotate-btn' onClick={() => setRotate(current => current + 90)}>
										<span><i className="fa-sharp fa-solid fa-rotate-right"></i></span>
										<button>Rotale right</button>
									</div>
								</div>
							</div>
						</div>
					</div> } */}
				</div>
				
			</div>
			
            
			{/* <Resize setSize={(value) => { setSize(value) }}></Resize> */}
        </div>
    )
}

export default UploadImg