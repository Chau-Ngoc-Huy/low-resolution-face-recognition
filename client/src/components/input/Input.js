import React, { useState, useCallback} from 'react'
// import { CanvasPreview } from './CanvasPreview'
import 'react-image-crop/dist/ReactCrop.css'
import Model from './input_components/Model'
import TypeTest from './input_components/TypeTest'
import UploadImg from './input_components/UploadImg'
import InputSlider from './input_components/Steps'
import ShowWebCam from './input_components/ShowWebCam'


function Input({onSubmit}) {
  const [model, setModel] = useState(0)
  const [typeTest, setTypeTest] = useState("FaceID")
  const [topNumber, setTopNumber] = useState(10)
  const [isFV, setIsFV] = useState(false)
  const [image1, setImage1] = useState(null)
  const [image2, setImage2] = useState(null)

  // console.log("a", image1)

  const handleSetType = (type) => {
    setTypeTest(type)
    setIsFV(type === "FaceVeri")
  }

  const handleSetImg1 = useCallback((v) => setImage1(v),[])
  const handleSetImg2 = useCallback((v) => setImage2(v),[])

  const handleOnClick = () => {
    onSubmit(image1, image2, model, typeTest, topNumber)
  }

  return (
    <div>
      <div className='setting'>
        <Model setModel={(value) => setModel(value)}></Model>
        <TypeTest onSetTypeTest={handleSetType}></TypeTest>
        {!isFV && <InputSlider value={topNumber} setValue={(value) => setTopNumber(value)}></InputSlider>}
      </div>
      
      
        {isFV && 
          <div className='double-dropzone'>
            <UploadImg setImg={handleSetImg1}  labelName='Image1'type='single-upload-image' ></UploadImg>
            <UploadImg setImg={handleSetImg2} labelName='Image2' type='single-upload-image' ></UploadImg>
          </div>
        }
      {!isFV && <div className='image-input-container'>
        <UploadImg type='single-upload-image' setImg={handleSetImg1} labelName='Image1'></UploadImg>
      </div>}
      <button className='submit-button' onClick={handleOnClick}>Submit</button>
    </div >
  )
}

export default Input