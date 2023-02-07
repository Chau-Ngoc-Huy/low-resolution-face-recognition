import React from "react";
// import maskedImg from "../assets/img/masked_image.png"
import {ImageList, ImageListItem, ImageListItemBar} from '@mui/material'


function ListImage({itemData}) {
    return (
        <>
            <div className="output-component">
                <div>
                <ImageList  cols={5} rowHeight={164}>
                    {itemData.map((item) => (
                        <ImageListItem key={item.img}>
                            <img
                                src={`${item.img}?w=248&fit=crop&auto=format`}
                                srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                alt={item.title}
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={item.title}
                                position="below"
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
                </div>
            </div>
        </>
    )
}

export default ListImage