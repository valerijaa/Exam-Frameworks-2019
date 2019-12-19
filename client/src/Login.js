import React, { Component } from 'react';
import AuthService from './AuthService';
import { navigate } from "@reach/router"

export default class Login extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.state = {
            username: "",
            password: "",
            errorMessage: null
        }
    }

    handleChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleLogin () {
        this.login(this.state.username, this.state.password);
    }

    async login(username, password) {
        try {
            await this.Auth.login(username, password);
            this.setState({
                errorMessage: null
            });
            this.props.onUserLoggedIn();
            navigate(`/`)
        } catch (e) {
            this.setState({
                errorMessage: "Invalid username or password"
            });
        }
    }

    render () {
        let invalidCredentialsAlert = null;
        if (this.state.errorMessage) {
            invalidCredentialsAlert = <div className="alert alert-danger" role="alert">
                {this.state.errorMessage}
            </div>;
        }
        return (
            <div>
                <header className="bg-primary text-white">
                    <div className="container text-center">
                        <h1>Login</h1>
                        <p className="lead">To add books for sale or access admin panel</p>
                    </div>
                </header>

                <div className="container">
                    <div className="row justify-content-md-center">
                        <div className="col-md-4 col-sm-12">
                            <form>
                                {invalidCredentialsAlert}
                                <div className="form-group">
                                    <label htmlFor="username">Username</label>
                                    <input onChange={event => this.handleChange(event)} type="text" name="username" className="form-control" id="username" placeholder="Enter username" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input onChange={event => this.handleChange(event)} type="password" className="form-control" name="password"  id="password" placeholder="Enter password" />
                                </div>
                                <button type="button" onClick={_ => this.handleLogin()} className="btn btn-primary">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}