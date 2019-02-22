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
            <i className="fa fa-money"></i> {props.amount} Kč
        </div>
    );
}