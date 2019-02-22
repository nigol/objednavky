import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Unsent from "./Unsent";
import './Navigation.css';
import Login from "./Login";
import Archive from "./Archive";
import Overview from "./Overview";

/**
* Navigation component.
* @param repository
*/
class Navigation extends Component {
    constructor(props) {
        super(props);
        this.handleUnsent = this.handleUnsent.bind(this);
        this.handleOverview = this.handleOverview.bind(this);
        this.handleArchive = this.handleArchive.bind(this);
        this.handleSignOut = this.handleSignOut.bind(this);
    }
    
    handleUnsent(e) {
        e.preventDefault();
        ReactDOM.unmountComponentAtNode(document.getElementById("root"));
        ReactDOM.render(<Unsent repository={this.props.repository}/>, document.getElementById("root"));
    }
    
    handleOverview(e) {
        e.preventDefault();
        ReactDOM.unmountComponentAtNode(document.getElementById("root"));
        ReactDOM.render(<Overview repository={this.props.repository}/>, document.getElementById("root"));
    }
    
    handleArchive(e) {
        e.preventDefault();
        ReactDOM.unmountComponentAtNode(document.getElementById("root"));
        ReactDOM.render(<Archive repository={this.props.repository} year={"" + (new Date()).getFullYear()}/>, document.getElementById("root"));
    }
    
    handleSignOut(e) {
        e.preventDefault();
        this.props.repository.logout();
        ReactDOM.unmountComponentAtNode(document.getElementById("root"));
        ReactDOM.render(<Login/>, document.getElementById("root"));
    }
    
    render() {
        return (
            <nav>
    	        <table style={{width: "50%", marginLeft: "auto", marginRight: "auto"}}>
    	            <tbody>
    	                <tr>
    	                    <td style={{textAlign: "center"}}>
    	                        <a href="#unsent" onClick={this.handleUnsent}><i className="fa fa-th-list fa-3x"></i></a>
    	                        <br />
    	                        <span className="navLabel">Neodeslané</span>
    	                    </td>
    	                    <td style={{textAlign: "center"}}>
    	                        <a href="#overview" onClick={this.handleOverview}><i className="fa fa-bar-chart fa-3x"></i></a>
    	                        <br />
    	                        <span className="navLabel">Přehled</span>
    	                    </td>
    	                    <td style={{textAlign: "center"}}>
    	                        <a href="#archive" onClick={this.handleArchive}><i className="fa fa-archive fa-3x"></i></a>
    	                        <br />
    	                        <span className="navLabel">Archiv</span>
    	                    </td>
    	                    <td style={{textAlign: "center"}}>
    	                        <a href="#signOut" onClick={this.handleSignOut}><i className="fa fa-sign-out fa-3x"></i></a>
    	                        <br />
    	                        <span className="navLabel">Odhlásit</span>
    	                    </td>
    	                </tr>
    	            </tbody>
    	        </table>
    	    </nav>
        );
    }    
}

export default Navigation;