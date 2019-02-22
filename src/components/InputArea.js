import React from 'react';
import "./InputArea.css";

/**
* InputArea component.
* @param icon
* @param label
* @param rows
* @param placeholder
* @param changeHandler
* @param name
* @param value
*/
export function InputArea(props) {
    return (
        <div className="inputWrapper">
            <label><i className={"fa " + props.icon + " fa-fw"}></i> {props.label}</label>
            <textarea rows={props.rows} placeholder={props.placeholder} onChange={props.changeHandler} name={props.name} value={props.value}></textarea>
        </div>
    );
}