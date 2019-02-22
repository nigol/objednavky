import React from 'react';
import './Dialog.css';

/**
* Dialog component.
*/
export function Dialog(props) {
    return (
        <div className="dialog">
            {props.children}
        </div>
    );
}