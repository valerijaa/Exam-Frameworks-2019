import React, {Component} from 'react';
import AuthService from './AuthService';
import {Link} from "@reach/router";
import CreateCategory from './CreateCategory';

class AdminPanel extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.state = {
            categories: []
        };
    }

    componentDidMount() {
        if (this.Auth.getIsAdmin() === false) {
            window.location = '/'; // couldn't get reach router navigate to work :( 
        }
        this.getData();
    }

    newCategoryCreated(category) {
        this.getData();
    }

    async deleteCategory(category) {
        var url = `${this.API_URL}/categories?id=${category.id}`;
        var options = {
            method: 'DELETE'
        };
        await this.Auth.fetch(url, options);
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
                <header className="bg-dark text-white">
                    <div className="container text-center">
                    <h1>Admin panel</h1>
                    </div>
                </header>

                <CreateCategory categoryCreated={(category) => this.newCategoryCreated(category)}/>

                <br/>
                <div className="container">
                    <div className="row">
                    <h3>List of categories:</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Name</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.categories.map(category => <tr key={category.id} >
                                <th scope="row">{category.id}</th>
                                    <td><Link to={`/categories/${category.normalizedName}`}>{category.name}</Link></td>
                                    <td><button onClick={() => this.deleteCategory(category)} className="btn btn-danger btn-sm"><span role="img" aria-label="book">🗑️</span></button></td>
                                </tr>)}
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default AdminPanel;
