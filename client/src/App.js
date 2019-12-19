import React, {Component} from 'react';
import { Router } from "@reach/router";
import AuthService from './AuthService';
import Frontpage from "./Frontpage";
import {Link, navigate} from "@reach/router";
import './css/App.css';
import Login from './Login';
import Category from './Category';
import Book from './Book';
import AdminPanel from './AdminPanel';

class App extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.state = {
            displayName: this.Auth.getUsername(),
            isLoggedIn: this.Auth.loggedIn(),
            isAdmin: this.Auth.getIsAdmin()
        };
    }

    async refreshUserState() {
        await this.setState({
            displayName: this.Auth.getUsername(),
            isLoggedIn: this.Auth.loggedIn(),
            isAdmin: this.Auth.getIsAdmin()
        });
    }

    async logout(event) {
        event.preventDefault();
        this.Auth.logout();
        await this.setState({
            isLoggedIn: false,
            displayName: null,
            isAdmin: false
        });
        navigate(`/`);
    }

    render() {
        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" id="mainNav">
                    <div className="container">
                    <Link className="navbar-brand js-scroll-trigger" to={`/`}>Bookstore</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarResponsive">
                        <ul className="navbar-nav ml-auto">
                            {this.state.isLoggedIn.toString() === 'true' ?
                            <React.Fragment>
                                {this.state.isAdmin.toString() === 'true' ?
                                    <li className="nav-item">
                                        <Link className="nav-link" to={`/admin`}>Admin panel</Link>
                                    </li>
                                    : null
                                }

                                <li className="nav-item">
                                    <a className="nav-link" href="#contact">{this.state.displayName}</a>
                                </li>
                                <li className="nav-item">
                                    <button className="btn nav-link" onClick={(event) => {this.logout(event)}}>Logout</button>
                                </li>
                            </React.Fragment>
                            :  <li className="nav-item">
                                <Link className="nav-link" to={`/login`}>Login</Link>
                            </li>}
                        </ul>
                    </div>
                    </div>
                </nav>
                <h1>Bookstore</h1>
                <Router>
                    <Frontpage path="/" />
                    <Login path="/login" onUserLoggedIn={() => this.refreshUserState()} />
                    <Category path="/categories/:normalizedName" />
                    <Book path="/books/:normalizedTitle" />
                    <AdminPanel path="/admin" />
                </Router>
            </React.Fragment>
        );
    }
}

export default App;
