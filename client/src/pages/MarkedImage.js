import React from 'react'
import {useCallback, useState} from 'react'
import Input from '../components/input/Input';
// import Input2 from '../components/input/Input2'
import Output from '../components/output/Output';
import Header from '../components/Header'
// import Model from '../components/Model';


function MarkedImage() {

const FaceID = "FaceID"
const FaceVeri = "FaceVeri"

const [typeTest, setTypeTest] = useState(FaceID)
const [time, setTime] = useState(0)
const [dis, setDis] = useState(0)
const [listImage, setListImage] = useState([])
// const [veriResult, setVeriResult] = useState({})
// const [idResult, setIdResult] = useState([])

const verifiedImage = (data) => {
	const requestOptions = {
		crossDomain:true,
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify(data)
	};

	// console.log(data)
	const model = data['model']
	const url = `http://127.0.0.1:8080/api/verification/${model}`
	return fetch(url, requestOptions)
	.then((response) => response.json())
	.then((res) => {
		console.log(res)
		const data = res.data
		// err = res.err
		// setVeriResult(data)
		setTime(data.time)
		setDis(data.distance)
		return data
	})
	.catch ((error) => console.error(error));
}

const identifiedImage = (data) => {
	const requestOptions = {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify(data)
	};

	const model = data['model']
	const topNumber = data['topNumber']
	const url = `http://127.0.0.1:8080/api/identification/${model}?offset=${topNumber}`
	return fetch(url, requestOptions)
	.then((response) => response.json())
	.then((res) => {
		const data = res.data
		console.log(data)
		setListImage(data.list_image)
		setTime(data.time)
	})
	.catch ((error) => console.error(error));
}

const handleSubmit = useCallback((image1, image2, model, typeTest, topNumber) => {
	setTypeTest(typeTest)
	const data = {
		image1: image1,
		image2: image2,
		model: model,
		topNumber: topNumber,
		type: typeTest, 
	}
	if (typeTest === FaceVeri) {
		verifiedImage(data)
	}
	else {
		identifiedImage(data)
	}
	// console.log(data);
}, [])
return (
	<div className='marked-image-app'>
	<div className='header-container'>
		<Header></Header>
	</div>
	<div className='input-container'>
		<h4 className='input-text'>Input</h4>
		<Input onSubmit={handleSubmit}></Input>
	</div>
	<div className='output-container'>
		<h4 className='output-text'>Output</h4>
		{(typeTest===FaceID) && <Output itemData={listImage} time={time}></Output>}
		{(typeTest===FaceVeri) && <div>
			<h1> Distance: {dis}</h1>
			<h1>Time: {time}</h1>
		</div>}
	</div>
	</div>
)
}

export default MarkedImage;
