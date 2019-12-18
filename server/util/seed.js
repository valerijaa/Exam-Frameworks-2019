const bcrypt = require('bcryptjs');  
const mongo = require('../reusable/mongo');

/**** Exports *****/
module.exports = {};
module.exports.seedDataIfNeeded = function(callback) {
    mongo.getUsers(function(users) {
        // if there is any user, then no seeding needed
        if (users.length > 0) {
            console.log("No need to seed database");
            callback();
            return;
        }

        // create test user
        var adminUser = {
            'id': 1,
            'username': 'valerija',
            'password': '123',
            'isAdmin': true
        };
        var johnUser = {
            'id': 2,
            'username': 'john',
            'password': '345',
            'isAdmin' : false
        };
        var janeUser = {
            'id': 3,
            'username': 'jane',
            'password': '345',
            'isAdmin' : false
        };

        var users = [adminUser, johnUser, janeUser];
        users.forEach(user => {
            bcrypt.hash(user.password, 10, function(err, hash) {
                user.hash = hash; // The hash has been made, and is stored on the user object.
                delete user.password; // The clear text password is no longer needed
                mongo.addUser(user, function(result) {});
             });
        });

        // categories
        var programmingCategory = {
            'id': 1,
            'name': 'Programming'
        };
        var biographyCategory = {
            'id': 2,
            'name': 'Programming'
        };
        var fictionCategory = {
            'id': 3,
            'name': 'Fiction'
        };
        var categories = [
            programmingCategory,
            biographyCategory,
            fictionCategory
        ];
        categories.forEach(category => {
            mongo.addCategory(category, function(result) {});
        });

        // books
        var books = [
            {
                'id': 1,
                'title': 'Film tie-in edition of Stephen Kings IT',
                'author': 'Stephen King',
                'categoryId': fictionCategory.id,
                'price': 5.99,
                'seller': {
                    'name':'Hachette UK',
                    'email': 'contact@hachette.co.uk'
                },
                'imageUrl':'https://books.google.com/books/content/images/frontcover/W1X51dmarEUC?fife=w200-h300'
            },
            {
                'id': 2,
                'title': 'Dracula',
                'author': 'Simon and Schuster',
                'categoryId': fictionCategory.id,
                'price': 1.18,
                'seller': {
                    'name':'Simon and Schuster',
                    'email': 'hello@sands.com'
                },
                'imageUrl':'https://books.google.com/books/content/images/frontcover/TMYFAwAAQBAJ?fife=w200-h300'
            },
            {
                'id': 3,
                'title': 'Moneyball: The Art of Winning an Unfair Game',
                'author': 'Michael Lewis',
                'categoryId': biographyCategory.id,
                'price': 12.28,
                'seller': {
                    'name':'W. W. Norton & Company',
                    'email': 'contact@norton.com'
                },
                'imageUrl':'https://books.google.com/books/content/images/frontcover/oIYNBodW-ZEC?fife=w200-h300'
            },
            {
                'id': 4,
                'title': 'Great Again: How to Fix Our Crippled America',
                'author': 'Donald J. Trump',
                'categoryId': biographyCategory.id,
                'price': 13.33,
                'seller': {
                    'name':'Simon and Schuster',
                    'email': 'hello@sands.com'
                },
                'imageUrl':'https://books.google.com/books/content/images/frontcover/K7eUCgAAQBAJ?fife=w200-h300'
            },
            {
                'id': 5,
                'title': 'The Audacity of Hope: Thoughts on Reclaiming the American Dream',
                'author': 'Barack Obama',
                'categoryId': biographyCategory.id,
                'price': 7.88,
                'seller': {
                    'name':'Canongate Books',
                    'email': 'canon@gate.com'
                },
                'imageUrl':'https://books.google.com/books/content/images/frontcover/8zR-1qOLq20C?fife=w200-h300'
            }
        ];
        books.forEach(book => {
            mongo.addBook(book, function(result) {});
        });

        console.log("Database seed completed");
        callback();
    });
};