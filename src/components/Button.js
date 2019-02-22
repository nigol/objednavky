import React from 'react';
import './Button.css';

/**
* Button component.
* @param action
* @param type
* @param icon
*/
export function Button(props) {
    return (
        <div className="buttonWrapper">
		    <a href="#button" onClick={props.action}>
		        <div className={"button buttonRounded " + props.type}>
		            <i className={"fa " + props.icon}></i> {props.value}
		        </div>
		    </a>
	    </div>
    );
}