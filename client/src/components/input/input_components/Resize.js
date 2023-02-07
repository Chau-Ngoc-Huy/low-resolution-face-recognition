import React from "react";

function Resize({ setSize }) {
    return (
        <>
            <div className="model-container">
                <label className="model-label label">size</label>
                <select className="model-select" onChange={(e) => setSize(+e.target.value)}>
                    <option value="64">64 x 64</option>
                    <option value="256">256 x 256</option>
                </select>
                <p className="model-text">Choose a size depending on the input image.</p>
            </div>
        </>
    )
}

export default Resize