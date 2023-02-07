import React from "react";

function TypeTest({ onSetTypeTest }) {
    return (
        <>
            <div className="model-container">
                <label className="model-label label">Type of FR</label>
                <select className="model-select" onChange={(e) => onSetTypeTest(e.target.value)}>
                    <option value="FaceID">Face Identification</option>
                    <option value="FaceVeri">Face Verification</option>
                </select>
                <p className="model-text">Choose a type of face recognition.</p>
            </div>
        </>
    )
}

export default TypeTest