import React from "react";
import SideBarItem from "./sideBarItem";

export default function SideBar(props){
    console.log(props.listOfThings)
    return(
        <div className="sidebar">
            {props.listOfThings.map(x => {
                return(
                    <SideBarItem key={x._id} displayName={x.Description}></SideBarItem>
                )
            } )}
        </div>
    )
}