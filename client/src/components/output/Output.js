import React from "react";
// import maskedImg from "../assets/img/masked_image.png"
// import {ImageList, ImageListItem, ImageListItemBar} from '@mui/material'
import ListImage from './output_components/ListImage'


function Output({itemData, time}) {
    return (
        <>
            <div className="output-component">
                <div>
                    <label className="result-text">Time: {time + 's'}</label>
                    <ListImage itemData={itemData}></ListImage>
                </div>
            </div>
        </>
    )
}

export default Output