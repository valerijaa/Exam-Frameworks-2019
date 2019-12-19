import React, {Component} from 'react';
import AuthService from './AuthService';
import {Link} from "@reach/router";

class Frontpage extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.state = {
            categories: []
        };
    }

    componentDidMount() {
        this.getData();
    }

    async getData() {
        const resp = await this.Auth.fetch(`${this.API_URL}/categories`);
        const data = await resp.json();
        this.setState({
            categories: data
        });
    }

    render() {
        return (
            <div>
                <header className="bg-primary text-white">
                    <div className="container text-center">
                    <h1>Welcome to Bookstore <span role="img" aria-label="books">📚</span></h1>
                    <p className="lead">Get some, read some</p>
                    </div>
                </header>

                <div className="container">
                    <div className="row">
                        {this.state.categories.map(category => <div className="col-4" key={category.id} >
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <Link to={`/categories/${category.normalizedName}`}>{category.name}</Link>
                                    </h5>
                                    <p className="card-text">{category.description}</p>
                                </div>
                            </div>
                        </div>)}
                    </div>
                </div>
            </div>
        );
    }
}

export default Frontpage;
