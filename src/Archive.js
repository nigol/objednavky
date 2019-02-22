import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Navigation from "./Navigation";
import Edit from "./Edit";
import {PriceTag} from "./PriceTag";
import {PageHeader} from "./components/PageHeader";
import "./Archive.css";

/**
* Filter by years.
* @param years
* @param filterHandler
* @param year 
*/
class FilterYear extends Component {
    constructor(props) {
        super(props);
        this.state = {year: props.year}
        this.handleFilter = this.handleFilter.bind(this);
    }
    
    handleFilter(e) {
        e.preventDefault();
        this.setState({year: e.target.value});
        this.props.filterHandler(e.target.value);
    }
    
    render() {
        return (
            <div>
                <label htmlFor="yearSelect">Rok: </label>
                <select id="yearSelect" onChange={this.handleFilter} value={this.state.year}>
                    {this.props.years.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
            </div>
        );
    }
}

/**
* Row in table.
* @param item
* @param repository
* @param year
*/
class ArchiveTableRow extends Component {
    constructor(props) {
        super(props);
        this.handleEdit = this.handleEdit.bind(this);
    }
    
    handleEdit(e) {
        e.preventDefault();
        const backHandler = () => {
            ReactDOM.unmountComponentAtNode(document.getElementById("root"));
            ReactDOM.render(<Archive repository={this.props.repository} year={this.props.year}/>, document.getElementById("root"));
        };
        ReactDOM.unmountComponentAtNode(document.getElementById("root"));
        ReactDOM.render(<Edit item={this.props.item} back={backHandler} repository={this.props.repository}/>, document.getElementById("root"));
    }
    
    render() {
        return (
            <tr>
                <td width="25%">
        		    <a href="#edit" onClick={this.handleEdit}>{this.props.item.name}</a>
                </td>
                <td width="15%">
        		    {this.props.item.dateOfPay}
                </td>
                <td width="30%">
        		    <a href="#edit" onClick={this.handleEdit}>{this.props.item.item}</a>
                </td>
                <td width="15%">
                    <PriceTag amount={this.props.item.amount} type={this.props.item.isPaid ? "paid" : "unpaid"}/>
                </td>
                <td width="15%">
        		    {parseInt(this.props.item.amount) + (this.props.item.actualPost == undefined ? 0 : 
                        parseInt(this.props.item.actualPost))}
                </td>
            </tr>
        );
    }
}

/**
* Archive component.
* @param repository
* @param year
*/
class Archive extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isError: false,
            items: [],
            years: [],
            year: props.year
        };
        this.handleFilter = this.handleFilter.bind(this);
    }
    
    handleFilter(year) {
        this.props.repository.getAllItems({
            successHandler: data => {
                this.setState({
                    items: data.filter(item => year === (item.dateOfPay === undefined ? "" : item.dateOfPay.substring(6, 10))),
                    year: year
                });
            },
            errorHandler: err => this.setState({isError: true})
        });
    }
    
    componentDidMount() {
        this.props.repository.getAllItems({
            successHandler: data => {
                let years = Object.getOwnPropertyNames(data
                        .map(item => item.dateOfPay === undefined ? "" : item.dateOfPay.substring(6, 10))
                        .reduce((acc, i) => {
                            let copy = Object.assign({}, acc);
                            copy[i] = 1;
                            return copy;
                        }, {}));
                this.setState({items: data.filter(item => this.state.year === (item.dateOfPay === undefined ? "" : item.dateOfPay.substring(6, 10))), years: years});
            },
            errorHandler: err => this.setState({isError: true})
        });
    }
    
    render() {
        return (
            <div>
                <Navigation repository={this.props.repository}/>
                <PageHeader headerText="Archiv"/>
                <p>
                    {"V roce " + this.state.year + " je " + this.state.items.length + " položek."}
                </p>
                <br/>
                <FilterYear years={this.state.years} filterHandler={this.handleFilter} year={this.state.year}/>
                <table className="archiveTable">
                    <thead>
                        <tr>
                            <th>JMÉNO</th>
                            <th>PLATBA</th>
                            <th>VĚC</th>
                            <th>ČÁSTKA</th>
                            <th>CELKEM</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.items.map(item => <ArchiveTableRow key={item.id} item={item} repository={this.props.repository} year={this.state.year}/>)}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Archive;
