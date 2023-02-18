import React, { useState, useCallback, useRef, useEffect} from 'react'
import Webcam from "react-webcam";

function ShowWebCam({setImgSrc, imgSrc, setFileName, files}) {

    // const [fileName, setFileName] = useState("")
    const [showWebCam, setShowWebCam] = useState(false)
    // const [files, setFiles] = useState([]);
    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };
    const webcamRef = useRef(null);
    const capture = useCallback(
        () => {
          const imageSrc = webcamRef.current.getScreenshot();
          setImgSrc(imageSrc);
          setFileName(imageSrc)
        },
        [webcamRef]
    );
    // console.log(showWebCam)
    const handleShowWebCam = useCallback(() => {
        setShowWebCam(true)
    }, [])

    useEffect(() => {
        files.map(file => {
          setFileName(file.path)
          return setImgSrc(file.preview)
        })
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
      }, [files]);
    return <div className="webcam-container float-left">
        <label className='model-label label'>Webcam</label>
        <div className="webcam" onClick={handleShowWebCam}>
          <span><i className="fa-solid fa-camera"></i></span>
          <button>
            Take a photo with webcam
          </button>
        </div>
        {showWebCam && (
          <>
            {!imgSrc && (
              <>
                <Webcam
                    className='live-cam'
                    audio={false}
                    //   height={360}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    //   width={720}
                    videoConstraints={videoConstraints}
                />
                <div className='webcam-button'>
                    <button onClick={capture} className="take-photo">Take photo</button>
                    <button onClick={() => setShowWebCam(false)} className="cancel">Cancel</button>
                </div>
              </>
            )}
          </>
        )}
        
    </div>
}
export default ShowWebCam
