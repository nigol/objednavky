import React from 'react';
import './Message.css';

/**
* Message component.
* @param render
* @param kind
* @param icon
*/
export function Message(props) {
    if (!props.render) {
        return null;
    }
    return (
        <div className={"message " + props.kind}>
            <i className={"fa " + props.icon + " fa-fw"}></i> {props.message}
        </div>
    );
}