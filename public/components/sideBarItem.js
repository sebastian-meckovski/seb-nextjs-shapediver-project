import React from "react";

export default function SideBarItem(props){
    return (
        <div className="sideBarItem">
            <p>{props.displayName}</p>
        </div>
    )
}