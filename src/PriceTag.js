import React from 'react';
import './PriceTag.css';

/**
* PriceTag component.
* @param type
* @param amount
*/
export function PriceTag(props) {
    return (
        <div className={"roundedPrice price " + props.type}>
            {props.amount} Kč
        </div>
    );
}
