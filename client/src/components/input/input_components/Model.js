import React from "react";

function Model({ setModel }) {
    return (
        <>
            <div className="model-container">
                <label className="model-label label">Model</label>
                <select className="model-select" onChange={(e) => setModel(e.target.value)}>
                    <option value="0">TCN</option>
                    <option value="1">EIPNet</option>
                </select>
                <p className="model-text">Choose a model depending on the input image.</p>
            </div>
        </>
    )
}

export default Model