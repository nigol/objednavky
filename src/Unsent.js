import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Button} from "./components/Button";
import {Message} from "./components/Message";
import {PriceTag} from "./PriceTag";
import {PageHeader} from "./components/PageHeader";
import Navigation from "./Navigation";
import Edit from "./Edit";
import "./Unsent.css";

/**
* Row in table.
* @param sendHandler
* @param repository
*/
class UnsentTableRow extends Component {
    constructor(props) {
        super(props);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSend = this.handleSend.bind(this);
    }
    
    handleEdit(e) {
        e.preventDefault();
        const backHandler = () => {
            ReactDOM.unmountComponentAtNode(document.getElementById("root"));
            ReactDOM.render(<Unsent repository={this.props.repository} />, document.getElementById("root"));
        };
        ReactDOM.unmountComponentAtNode(document.getElementById("root"));
        ReactDOM.render(<Edit item={this.props.item} back={backHandler} repository={this.props.repository}/>, document.getElementById("root"));
    }
    
    handleSend(e) {
        e.preventDefault();
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        this.props.item.dateOfSent = day + "." + month + "." + year;
        this.props.item.isSent = true;
        this.props.item.actualPost = window.prompt("Skutečné poštovné", "");
        this.props.repository.saveItem({
            data: this.props.item,
            successHandler: items => {
                this.props.sendHandler();
            },
            errorHandler: err => err
        });
    }
    
    render() {
        return (
            <tr>
                <td width="20%">
        		    <Button icon="fa-envelope-square" type="default" value="Odeslat" action={this.handleSend}/>
                </td>
                <td width="60%">
                    <i className="fa fa-shopping-bag"></i> <a href="#edit" onClick={this.handleEdit}>{this.props.item.item}</a>
                    <br />
                    <i className="fa fa-user-circle"></i> <a href="#edit" onClick={this.handleEdit}> <em>{this.props.item.name}</em></a>
                </td>
                <td width="20%">
                    <PriceTag amount={this.props.item.amount} type={this.props.item.isPaid ? "paid" : "unpaid"}/>
                </td>
            </tr>
        );
    }
}

class Unsent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displaySentMsg: false,
            items: []
        };
        this.handleNew = this.handleNew.bind(this);
        this.handleSend = this.handleSend.bind(this);
    }
    
    componentDidMount() {
        this.props.repository.getAllItems({
            successHandler: data => this.setState({
                items: data.filter(item => !item.isSent)
            }),
            errorHandler: err => err
        });
    }
    
    handleSend() {
        this.props.repository.getAllItems({
            successHandler: data => this.setState({
                items: data.filter(item => !item.isSent)
            }),
            errorHandler: err => err
        });
        this.setState({displaySentMsg: true});
    }
    
    handleNew(e) {
        e.preventDefault();
        const backHandler = () => {
            ReactDOM.unmountComponentAtNode(document.getElementById("root"));
            ReactDOM.render(<Unsent repository={this.props.repository}/>, document.getElementById("root"));
        };
        let item = {};
        ReactDOM.unmountComponentAtNode(document.getElementById("root"));
        ReactDOM.render(<Edit item={item} back={backHandler} repository={this.props.repository}/>, document.getElementById("root"));
    }
    
    render() {
        return (
            <div>
                <Navigation repository={this.props.repository}/>
                <PageHeader headerText="Neodeslané objednávky"/>
                <Message kind="info" message="Odesláno." render={this.state.displaySentMsg}/>
                <Button icon="fa-plus-square" type="new" value="Nová objednávka" action={this.handleNew}/>
                <table className="unsentTable">
    		        <tbody>
    		            {
    		                this.state.items.length === 0 ?
    		                <tr></tr> :
    		                this.state.items.map(item => <UnsentTableRow key={item.id} item={item} repository={this.props.repository} sendHandler={this.handleSend}/>)
    		            }
    		        </tbody>
    		    </table>
    		</div>
        );
    }
}

export default Unsent;
