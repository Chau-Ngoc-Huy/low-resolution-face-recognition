import React from "react";
// import maskedImg from "../assets/img/masked_image.png"
import {ImageList, ImageListItem, ImageListItemBar} from '@mui/material'


function ListImage({itemData}) {
    return (
        <>
            <div className="list-image">
                <div>
                <ImageList  cols={3}>
                    {itemData.map((item, id) => (
                        <ImageListItem key={id}>
                            <img
                                src={`${item.img}?w=248&fit=crop&auto=format`}
                                srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                alt={item.dis}
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={"Top " + (id+1)}
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