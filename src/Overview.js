import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Navigation from "./Navigation";
import {PageHeader} from "./components/PageHeader";
import {Bar} from "./components/Bar";

/**
* Overview component.
* @param repository
*/
class Overview extends Component {
    constructor(props) {
        super(props);
        this.state = {years: [], max: 0}
    }
    
    componentDidMount() {
        this.props.repository.getAllItems({
            successHandler: data => {
                let yearsObj = data
                        .reduce((acc, i) => {
                            let copy = Object.assign({}, acc);
                            let key = i.dateOfPay === undefined ? "" : i.dateOfPay.substring(6, 10);
                            let sum = copy[key];
                            sum = sum == undefined ? i.amount : parseInt(sum) + parseInt(i.amount);
                            copy[key] = sum;
                            return copy;
                        }, {});
                let years = Object.getOwnPropertyNames(yearsObj)
                        .map(year => {
                            return {year: year, sum: yearsObj[year]};
                        });
                let max = years
                        .reduce((acc, y) => {
                            return y.sum > acc ? y.sum : acc;
                        }, 0);
                this.setState({years: years, max: max});
            },
            errorHandler: err => this.setState({isError: true})
        });
    }
    
    render() {
        return (
            <div>
                <Navigation repository={this.props.repository}/>
                <PageHeader headerText="Přehled"/>
                <div style={{width: "100%", padding: "10px"}}>
                    {this.state.years.map(year => <Bar year={year.year} sum={year.sum} max={this.state.max}/>)}
                </div>
            </div>
        );
    }
}

export default Overview;
