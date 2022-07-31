import React from "react";

export default function RangeSlider(props){


    
    return (
        <div>
            <input type="range" min="1200" max="2000" defaultValue={'1200'} step="100" className="slider"
                   onChange={props.handleChange}>
                
            </input>
        </div>
    )
}