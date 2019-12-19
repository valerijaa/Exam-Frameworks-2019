import React, {Component} from 'react';
import AuthService from './AuthService';
import {Link} from "@reach/router";

class Category extends Component {
    API_URL = process.env.REACT_APP_API_URL;

    constructor(props) {
        super(props);

        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.state = {
            normalizedName: this.props.normalizedName,
            category: null,
            books: []
        };
    }

    componentDidMount() {
        this.getData();
    }

    async getData() {
        // get category info if needed
        const categoryResponse = await this.Auth.fetch(`${this.API_URL}/categories/by-normalized-name?name=${this.state.normalizedName}`);
        const categoryData = await categoryResponse.json();
        this.setState({
            category: categoryData
        });

        // get books
        const booksResponse = await this.Auth.fetch(`${this.API_URL}/books/by-category?categoryId=${this.state.category.id}`);
        const booksData = await booksResponse.json();
        this.setState({
            books: booksData
        });
    }

    render() {
        let categoryName = "";
        let categoryDescription = "";
        if (this.state.category) {
            categoryName = this.state.category.name; 
            categoryDescription = this.state.category.description; 
        }

        let noBooksAvailableAlert = <div></div>;
        if (this.state.category && this.state.books.length === 0) {
            noBooksAvailableAlert = <div className="alert alert-info col-12" role="alert">No books in this category <span role="img" aria-label="no books">😫</span></div>
        }

        return (
            <div>
                <header className="bg-primary text-white">
                    <div className="container text-center">
                    <h1>{categoryName} <span role="img" aria-label="books">📚</span></h1>
                    <p className="lead">{categoryDescription}</p>
                    </div>
                </header>

                <div className="container">
                    <div className="row">
                    {noBooksAvailableAlert}
                    {this.state.books.map(book => <div className="col-4" key={book.id} >
                        <div className="card">
                            <img className="card-img-top" src={book.imageUrl} alt="book cover" />
                            <div className="card-body">
                                <h5 className="card-title">
                                    <Link to={`/books/${book.normalizedTitle}`}>{book.title}</Link>
                                </h5>
                                <p className="card-text">{book.author}</p>
                            </div>
                            </div>
                        </div>)}
                    </div>
                </div>
            </div>
        );
    }
}

export default Category;
