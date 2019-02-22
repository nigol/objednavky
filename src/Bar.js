import React from 'react';
import "./Bar.css";

/**
* Chart bar component.
* @param sum
* @param max
* @param year
*/
export function Bar(props) {
    let percent = parseInt(props.sum) * 100 / parseInt(props.max);
    let style = {
        width: percent + "%"
    };
    return (
        <div className="bar" style={style}>
            <span className="yearLabel">
                {props.year}
            </span>
            <span className="sum">
                {props.sum} Kč
            </span>
        </div>
    ); 
}
