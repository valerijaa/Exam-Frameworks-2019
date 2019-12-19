import React, {Component} from 'react';
import AuthService from './AuthService';
import {Link} from "@reach/router";
import './css/Book.css';

class Book extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);

        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.state = {
            normalizedTitle: this.props.normalizedTitle,
            book: null,
            bookCategory: null
        };
    }

    componentDidMount() {
        this.getData();
    }

    async getData() {
        const bookResponse = await this.Auth.fetch(`${this.API_URL}/books/by-normalized-title?title=${this.state.normalizedTitle}`);
        const bookData = await bookResponse.json();
        this.setState({
            book: bookData
        });

        // get category
        const categoryResponse = await this.Auth.fetch(`${this.API_URL}/categories?id=${this.state.book.categoryId}`);
        const categoryData = await categoryResponse.json();
        this.setState({
            bookCategory: categoryData
        });
    }

    render() {
        let bookCategoryContents = <div></div>;
        if (this.state.bookCategory) {
            bookCategoryContents = <div className="book-information">
                <label>Category:</label>
                <Link to={`/categories/${this.state.bookCategory.normalizedName}`}>{this.state.bookCategory.name}</Link>
            </div>;
        }

        let bookContents = <p>Loading..</p>;
        if (this.state.book) {
            bookContents = <div>
                <header className="bg-primary text-white">
                    <div className="container text-center">
                    <h1>{this.state.book.title} <span role="img" aria-label="book">📖</span></h1>
                    </div>
                </header>

                <div className="container">
                    <div className="row">
                        <div className="col col-md-6 col-xs-12">
                            <img src={this.state.book.imageUrl} className="img-thumbnail img-fluid mx-auto d-block" alt="book cover" />
                        </div>
                        <div className="col col-md-6 col-xs-12">
                            <div className="book-information">
                                <label>Author:</label>
                                {this.state.book.author}
                            </div>
                            <div className="book-information">
                                <label>Seller:</label>
                                {this.state.book.seller.name} / <a href={"mailto:" + this.state.book.seller.email}>{this.state.book.seller.email}</a> 
                            </div>
                            <div className="book-information">
                                <label>Price:</label>
                                {this.state.book.price}
                            </div>
                            {bookCategoryContents}
                        </div>
                    </div>
                </div>
            </div>
        }

        return (
            <div>
                {bookContents}
            </div>
        );
    }
}

export default Book;
