var mongoose = require('mongoose');
var url = process.env.DB_CONNECTION_STRING || "mongodb://admin:secret@localhost:27017";
var Schema = mongoose.Schema;

var User = null;
var Category = null;
var Book = null;

function ensureConnectionCreated(callback) {
    if (User) {
        callback();
        return;
    }

    // Connection to local database named 'test'. If 'test' doesn't exists, it will automatically be created.
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((connection) => { // When the Promise resolves, we do some stuff.
        console.log("Database connected");
        configureSchemas();
        callback();
    })
    .catch(e => { // If any errors happens during connection, we print them here.
        console.error(e)
    });
}

function configureSchemas() { 
    mongoose.model('User', 
        new Schema({
            id : Number,
            username : String,
            hash : String,
            isAdmin : Boolean
        }));
    mongoose.model('Category', 
        new Schema({
            id : Number,
            name : String
        }));
    mongoose.model('Book', 
        new Schema({
            id : Number,
            title : String,
            author : String,
            categoryId: Number,
            price: Number,
            seller: {
                name: String,
                email: String
            },
            imageUrl : String
        }));

    User = mongoose.model('User');
    Category = mongoose.model('Category');
    Book = mongoose.model('Book');
}

module.exports = {};

// users
module.exports.getUserByUsername = function(username, callback) {
    ensureConnectionCreated(function() {
        User.findOne({'username':username}).then(
            (user) => {
                callback(user);
            }
        );
    })
};
module.exports.getUsers = function(callback) {
    ensureConnectionCreated(function() {
        User.find({}).then(
            (users) => {
                callback(users);
            }
        );
    })
};
module.exports.addUser = function(user, callback) {
    var newUser = new User({
        'id': user.id,
        'username': user.username,
        'hash': user.hash,
        'isAdmin': user.isAdmin
    });

    ensureConnectionCreated(function() {
        newUser.save().then(
            (savedUser) => {
                console.log("Saved new user");
                callback(savedUser);
            }
        );
    });
};

// categories
module.exports.addCategory = function(category, callback) {
    var newCategory = new Category({
        'id': category.id,
        'name': category.name
    });

    ensureConnectionCreated(function() {
        newCategory.save().then(
            (savedCategory) => {
                console.log("Saved new category");
                callback(savedCategory);
            }
        );
    });
};
module.exports.deleteCategory = function(id, callback) {
    ensureConnectionCreated(function() {
        Category.deleteOne({ 'id': id}, function (err) {
            console.log("Deleted category");
            callback();
        });
    });
};
module.exports.getCategories = function(callback) {
    ensureConnectionCreated(function() {
        Category.find({}).then(
            (categories) => {
                callback(categories);
            }
        );
    })
};

// books
module.exports.addBook = function(book, callback) {
    var newBook = new Book({
        'id': book.id,
        'title': book.title,
        'author': book.author,
        'categoryId': book.categoryId,
        'price': book.price,
        'seller' : book.seller,
        'imageUrl': book.imageUrl
    });

    ensureConnectionCreated(function() {
        newBook.save().then(
            (savedBook) => {
                console.log("Saved new book");
                callback(savedBook);
            }
        );
    });
};
module.exports.deleteBook = function(id, callback) {
    ensureConnectionCreated(function() {
        Book.deleteOne({ 'id': id}, function (err) {
            console.log("Deleted book");
            callback();
        });
    });
};
module.exports.getBook = function(id, callback) {
    ensureConnectionCreated(function() {
        Book.findOne({'id':id}).then(
            (book) => {
                callback(book);
            }
        );
    })
};
module.exports.getBooks = function(callback) {
    ensureConnectionCreated(function() {
        Book.find({}).then(
            (books) => {
                callback(books);
            }
        );
    })
};
module.exports.getBooksByCategory = function(categoryId, callback) {
    ensureConnectionCreated(function() {
        Book.find({'categoryId':categoryId}).then(
            (books) => {
                callback(books);
            }
        );
    })
};