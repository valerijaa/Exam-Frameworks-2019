import React, { Component } from 'react';
import AuthService from './AuthService';
import { navigate } from '@reach/router';

class CreateBook extends Component {
    API_URL = process.env.REACT_APP_API_URL;
    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.state = {
            title: "",
            author: "",
            price: null,
            sellerName: "",
            sellerEmail: "",
            imageUrl: "",
            categoryId: "",
            errorMessage: null,
            categories: []
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount () {
        if (this.Auth.loggedIn() === false) {
            window.location = '/login'; // couldn't get reach router navigate to work during 'componentDidMount' :( 
        }
        
        this.getCategoriesData();
    }

    async getCategoriesData () {
        const resp = await this.Auth.fetch(`${this.API_URL}/categories`);
        const data = await resp.json();
        this.setState({
            categories: data
        });
    }

    handleChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async createBook () {
        var url = `${this.API_URL}/books`;
        var options = {
            method: 'POST',
            body: JSON.stringify({
                title: this.state.title,
                author: this.state.author,
                price: this.state.price,
                categoryId: this.state.categoryId,
                seller: {
                    name: this.state.sellerName,
                    email: this.state.sellerEmail
                },
                imageUrl: this.state.imageUrl
            })
        };

        var result = await this.Auth.fetch(url, options);
        // deserialize new book
        let newBook = await result.json();
        // show error message is status is not OK
        if (result.ok === false) {
            this.setState({
                errorMessage: newBook.message
            });
            return;
        }

        // reset inputs
        this.setState({
            title: "",
            author: "",
            price: null,
            sellerName: "",
            sellerEmail: "",
            imageUrl: "",
            errorMessage: null,
            categoryId: ""
        });

        navigate(`/books/${newBook.normalizedTitle}`);
    }

    render () {
        let errorMessageAlert = null;
        if (this.state.errorMessage) {
            errorMessageAlert = <div className="alert alert-danger" role="alert">
                {this.state.errorMessage}
            </div>;
        }
        return (
            <div>
                <header className="bg-primary text-white">
                    <div className="container text-center">
                        <h1>Post a book</h1>
                        <p className="lead">Use this form to post a new book for sale</p>
                    </div>
                </header>

                <div className="container">
                    <div className="row justify-content-md-center">
                        <div className="col-md-6 col-sm-12">
                            <form>
                                {errorMessageAlert}
                                <div className="form-group">
                                    <label htmlFor="title">Title*</label>
                                    <input onChange={event => this.handleChange(event)} type="text" value={this.state.title}
                                        name="title" className="form-control" id="title" placeholder="Enter title" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="author">Author*</label>
                                    <input onChange={event => this.handleChange(event)} type="text" value={this.state.author} className="form-control"
                                        name="author" id="author" placeholder="Enter author" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="categoryId">Category*</label>
                                    <select className="form-control" name="categoryId" id="categoryId" value={this.state.categoryId} onChange={event => this.handleChange(event)}>
                                        <option value="" disabled>Choose a category</option>
                                        {this.state.categories.map(category => <option value={category.id} key={category.id} >
                                            {category.name}</option>
                                        )}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="price">Price*</label>
                                    <input onChange={event => this.handleChange(event)} type="number" value={this.state.pric} className="form-control"
                                        name="price" id="price" placeholder="Enter price" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="sellerName">Sellers name*</label>
                                    <input onChange={event => this.handleChange(event)} type="text" value={this.state.sellerName} className="form-control"
                                        name="sellerName" id="sellerName" placeholder="Enter sellers name" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="sellerEmail">Sellers email*</label>
                                    <input onChange={event => this.handleChange(event)} type="email" value={this.state.sellerEmail} className="form-control"
                                        name="sellerEmail" id="sellerEmail" placeholder="Enter sellers email" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="imageUrl">Book cover url</label>
                                    <input onChange={event => this.handleChange(event)} type="text" value={this.state.imageUrl} className="form-control"
                                        name="imageUrl" id="imageUrl" placeholder="If you leave is empty, random image will be assigned" />
                                </div>
                                <button type="button" onClick={_ => this.createBook()} className="btn btn-primary">Post a book</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateBook;