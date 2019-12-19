import React, {Component} from 'react';
import AuthService from './AuthService';

class CreateCategory extends Component {
    API_URL = process.env.REACT_APP_API_URL;
    constructor(props) {
        super(props);
        this.Auth = new AuthService(`${this.API_URL}/users/authenticate`);
        this.state = {
            name: "",
            description: "",
            errorMessage: null
        }
    }

    handleChange (event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async createCategory() {
        var url = `${this.API_URL}/categories`;
        var options = {
            method: 'POST',
            body: JSON.stringify({
                name: this.state.name,
                description: this.state.description
            })
        };

        var result = await this.Auth.fetch(url, options);
        // deserialize new category
        let newCategory = await result.json();
        // show error message is status is not OK
        if (result.ok === false) {
            this.setState({
                errorMessage: newCategory.message
            });
            return;
        }

        // reset inputs
        this.setState({
            name: "",
            description: "",
            errorMessage: null
        });

        // dispatch event to parenet
        this.props.categoryCreated(newCategory);
    }

    render() {
        let errorMessageAlert = null;
        if (this.state.errorMessage) {
            errorMessageAlert = <div className="alert alert-danger" role="alert">
                {this.state.errorMessage}
            </div>;
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <form>
                            <h3>Create new category:</h3>
                            {errorMessageAlert}
                            <div className="form-group">
                                <label htmlFor="name">Name*</label>
                                <input onChange={event => this.handleChange(event)} type="text" value={this.state.name}
                                name="name" className="form-control" id="name" placeholder="Enter category name" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <input onChange={event => this.handleChange(event)} type="text" value={this.state.description} className="form-control"
                                 name="description"  id="description" placeholder="Enter category description" />
                            </div>
                            <button type="button" onClick={_ => this.createCategory()} className="btn btn-primary">Create</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateCategory;

