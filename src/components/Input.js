import React from 'react';
import './Input.css';

/**
* Input component.
* @param icon
* @param label
* @param type
* @param placeholder
* @param changeHandler
* @param name
* @param value
*/
export function Input(props) {
    return (
        <div className="inputWrapper">
            <label><i className={"fa " + props.icon + " fa-fw"}></i> {props.label}</label>
	        <input type={props.type} placeholder={props.placeholder} onChange={props.changeHandler} name={props.name} value={props.value}/>
        </div>
    );
}
