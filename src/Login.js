import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Button} from "./components/Button";
import {Message} from "./components/Message";
import {Input} from "./components/Input";
import {Repository} from "./repository";
import Unsent from "./Unsent";
import {CognitoUserPool, AuthenticationDetails, CognitoUser} from "amazon-cognito-identity-js";
import {PageHeader} from "./components/PageHeader";

function getUserPool() {
    return new CognitoUserPool({
        UserPoolId: "eu-west-1_hJv7Lgb29",
        ClientId: "6er3ss198o2fqjf77h4rp2hsn1"
    });
}

function login(name, password, errHandler) {
    const userPool = getUserPool();
    const user = new CognitoUser({Username: name, Pool: userPool});
    const authenticationData = {Username: name, Password: password};
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    user.authenticateUser(authenticationDetails, {
        onSuccess: result => {
            let repository = Repository(result, user.getUsername(), user);
            ReactDOM.unmountComponentAtNode(document.getElementById("root"));
            ReactDOM.render(<Unsent repository={repository} />, document.getElementById("root"));
        },
        onFailure: errHandler,
        newPasswordRequired: (userAttributes, requiredAttributes) => {
            delete userAttributes.email_verified;
            user.completeNewPasswordChallenge(window.prompt("Zvolte si nové heslo", ""), userAttributes, this);
        }
    });
    /* user.forgotPassword({
        onSuccess: function (result) {
            console.log('call result: ' + result);
        },
        onFailure: function(err) {
            alert(err);
        },
        inputVerificationCode() {
            let verificationCode = prompt('Please input verification code ' ,'');
            let newPassword = prompt('Enter new password ' ,'');
            user.confirmPassword(verificationCode, newPassword, this);
        }
    }); */
}

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            password: "", 
            isError: false
        };
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleContinue = this.handleContinue.bind(this);
    }
    
    componentDidMount() {
        const user = getUserPool().getCurrentUser();
        if (user !== null) {
            user.getSession((err, session) => {
                if (!err) {
                    this.setState({user: user, session: session});
                }
            });
        }
    }
        
    handleChangeName(e) {
        e.preventDefault();
        this.setState({name: e.target.value});
    }
    
    handleChangePassword(e) {
        e.preventDefault();
        this.setState({password: e.target.value});
    }
    
    handleLogin(e) {
        e.preventDefault();
        login(this.state.name, this.state.password, err => this.setState({isError: true}));
    }
    
    handleContinue(e) {
        e.preventDefault(e);
        let repository = Repository(this.state.session, this.state.user.getUsername(), this.state.user);
        ReactDOM.unmountComponentAtNode(document.getElementById("root"));
        ReactDOM.render(<Unsent repository={repository} />, document.getElementById("root"));
    }
    
    render() {
        if (this.state.user !== undefined) {
            return (
                <div>
                    <PageHeader headerText="Objednávky"/>
                    <p>Jste přihlášen(a). Můžete pokračovat v používání aplikace.</p>
                    <Button icon="fa-check-square" type="default" value="Pokračovat" action={this.handleContinue}/>
                </div>
            );
        }
        return ( 
            <div>
                <PageHeader headerText="Objednávky"/>
                <Message icon="fa-exclamation-triangle" kind="info" message="Nesprávné jméno nebo heslo." 
                    render={this.state.isError}/>
                <Input icon="fa-user-o" type="text" placeholder="Jméno" label="Jméno" changeHandler={this.handleChangeName}/>
                <Input icon="fa-lock" type="password" placeholder="Heslo" label="Heslo" changeHandler={this.handleChangePassword}/>
                <Button icon="fa-check-square-o" type="default" value="Přihlásit" action={this.handleLogin}/>
            </div>
        );
    }
}

export default Login;