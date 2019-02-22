import React, { Component } from 'react';
import {Button} from "./components/Button";
import {Message} from "./components/Message";
import {PageHeader} from "./components/PageHeader";
import {Input} from "./components/Input";
import {InputArea} from "./components/InputArea";
import {Dialog} from "./components/Dialog";

function prepareDates(props) {
    let result = {};
    if (props.item.dateOfPay !== undefined) {
        let day = props.item.dateOfPay.split(".")[0];
        let month = props.item.dateOfPay.split(".")[1];
        let year = props.item.dateOfPay.split(".")[2];
        result.dateOfPay = year + "-" + month + "-" + day;    
    }
    if (props.item.dateOfSent !== undefined) {
        let day = props.item.dateOfSent.split(".")[0];
        let month = props.item.dateOfSent.split(".")[1];
        let year = props.item.dateOfSent.split(".")[2];
        result.dateOfSent = year + "-" + month + "-" + day;
    }
    return result;
}

function reformatDate(date) {
    if (date !== undefined) {
        let day = date.split("-")[2];
        let month = date.split("-")[1];
        let year = date.split("-")[0];
        return day + "." + month + "." + year;
    }
}

/**
* Edit component.
* @param item
* @param back
* @param repository
*/
class Edit extends Component {
    constructor(props) {
        super(props);
        let state = {
            displayDoneMsg: false,
            displayErrMsg: false,
            displayRemovedMsg: false
        };
        this.state = Object.assign({}, props.item, state, prepareDates(props));
        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
        this.back = this.back.bind(this);
        this.remove = this.remove.bind(this);
        this.clearMessages = this.clearMessages.bind(this);
        this.clearValueFor = this.clearValueFor.bind(this);
    }
    
    handleChange(e) {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    clearValueFor(name) {
        return (e) => {
            this.setState({[name]: ""});
        }
    }

    clearMessages() {
        this.setState({
            displayDoneMsg: false,
            displayErrMsg: false,
            displayRemovedMsg: false
        });
    }
    
    save(e) {
        e.preventDefault();
        this.clearMessages();
        let dateOfPay = this.state.dateOfPay === "" ? undefined : this.state.dateOfPay;
        let dateOfSent = this.state.dateOfSent === "" ? undefined : this.state.dateOfSent;
        let item = {
            id: this.state.id,
            name: this.state.name,
            email: this.state.email,
            address: this.state.address,
            item: this.state.item,
            amount: this.state.amount,
            vs: this.state.vs,
            dateOfPay: reformatDate(dateOfPay),
            paidPost: this.state.paidPost,
            actualPost: this.state.actualPost,
            dateOfSent: reformatDate(dateOfSent),
            isPaid: dateOfPay !== undefined,
            isSent: dateOfSent !== undefined
        };
        this.props.repository.saveItem({
            data: item,
            successHandler: items => {
                this.setState({displayDoneMsg: true});
            },
            errorHandler: err => this.setState({displayErrMsg: true})
        });
    }
    
    back(e) {
        e.preventDefault();
        this.clearMessages();
        this.props.back();
    }
    
    remove(e) {
        e.preventDefault();
        this.clearMessages();
        this.props.repository.removeItem({
            data: this.state,
            successHandler: items => {
                this.setState({
                    displayRemovedMsg: true,
                    id: undefined
                });
            },
            errorHandler: err => this.setState({displayErrMsg: true})
        });
    }
    
    render() {
        return (
            <div>
                <PageHeader headerText="Úprava položky"/>
                <Message kind="info" message="Uloženo." render={this.state.displayDoneMsg}/>
                <Message kind="info" message="Smazáno." render={this.state.displayRemovedMsg}/>
                <Message icon="fa-exclamation-triangle" kind="info" message="Operace se nezdařila." 
                    render={this.state.displayErrMsg}/>
                <Button icon="fa-arrow-circle-o-left" type="normal" value="Zpět" action={this.back}/>
                <Dialog>
                    <Input icon="fa-user-circle" type="text" placeholder="Jméno" label="Jméno" changeHandler={this.handleChange} name="name" value={this.state.name}/>
                    <Input icon="fa-at" type="email" placeholder="Email" label="Email" changeHandler={this.handleChange} name="email" value={this.state.email}/>
                    {this.state.email === undefined ? "" : 
            
                        <a href={"mailto:" + this.state.email + "?subject=" + encodeURI(this.state.item)}>Odeslat email</a>}
                    <InputArea icon="fa-address-card-o" rows="4" placeholder="Adresa" label="Adresa" changeHandler={this.handleChange} name="address" value={this.state.address}/>
                    <Input icon="fa-shopping-bag" type="text" placeholder="Věc" label="Věc" changeHandler={this.handleChange} name="item" value={this.state.item}/>
                    <Input icon="fa-money" type="number" placeholder="Částka" label="Částka" changeHandler={this.handleChange} name="amount"  value={this.state.amount}/>
                    <Input icon="fa-angle-right" type="text" placeholder="Variabilní symbol" label="Variabilní symbol" changeHandler={this.handleChange} name="vs" value={this.state.vs}/>
                    <a href="#clear" style={{float: "right", margin: "1em"}} onClick={this.clearValueFor("dateOfPay")}><i className="fa fa-trash-o"></i></a>
                    <Input icon="fa-calendar" type="date" placeholder="Datum platby" label="Datum platby" changeHandler={this.handleChange} name="dateOfPay" value={this.state.dateOfPay}/>
                    <Input icon="fa-money" type="number" placeholder="Zaplacené poštovné" label="Zaplacené poštovné" changeHandler={this.handleChange} name="paidPost" value={this.state.paidPost}/>
                    <Input icon="fa-money" type="number" placeholder="Skutečné poštovné" label="Skutečné poštovné" changeHandler={this.handleChange} name="actualPost" value={this.state.actualPost}/>
                    <a href="#clear" style={{float: "right", margin: "1em"}} onClick={this.clearValueFor("dateOfSent")}><i className="fa fa-trash-o"></i></a>
                    <Input icon="fa-calendar" type="date" placeholder="Datum odeslání" label="Datum odeslání" changeHandler={this.handleChange} name="dateOfSent" value={this.state.dateOfSent}/>
                </Dialog>
                <Message kind="info" message="Uloženo." render={this.state.displayDoneMsg}/>
                <Message kind="info" message="Smazáno." render={this.state.displayRemovedMsg}/>
                <Message icon="fa-exclamation-triangle" kind="info" message="Operace se nezdařila." 
                    render={this.state.displayErrMsg}/>
                <table className="fullWidth">
                    <tbody>
                        <tr>
        	                <td>
        	                    <Button icon="fa-flag-checkered" type="default" value="Uložit" action={this.save}/>
        	                </td>
        	                <td>
        	                    <Button icon="fa-arrow-circle-o-left" type="normal" value="Zpět" action={this.back}/>
        	                </td>
        	                <td>
        	                    {this.state.id === undefined ? "" : 
        	                        <Button icon="fa-trash-o" type="danger" value="Smazat" action={this.remove}/>}
        	                </td>
        	            </tr>
                    </tbody>
    	        </table>
    	    
                <div style={{height: "50px"}}/>
            </div>

        );

    }
}

export default Edit;
