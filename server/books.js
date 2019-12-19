/**
 * Inspiration mix from react qa assignment app and lesson examples.
 */
module.exports = () => {
    let express = require('express');
    let router = express.Router();
    const numbers = require('./util/numbers');
    const mongo = require('./reusable/mongo');

    router.get('/by-normalized-title', (req, res) => {
        mongo.getBookByTitle(req.query.title, function(book){
            return res.json(book);
        });
    });

    router.get('/by-category', (req, res) => {
        if (!req.query.categoryId)
            return res.status(400).send({
                message: 'Invalid category'
            });

        mongo.getBooksByCategory(req.query.categoryId, function(books){
            return res.json(books);
        });
    });

    router.get('/', (req, res) => {
        mongo.getBooks(function(books){
            return res.json(books);
        });
    });

    router.post('/', (req, res) => {
        if (!req.body.title)
            return res.status(400).send({
                message: 'Invalid title'
            });

        if (!req.body.author)
            return res.status(400).send({
                message: 'Invalid author'
            });

        if (!req.body.categoryId)
            return res.status(400).send({
                message: 'Invalid category id'
            });

        if (!req.body.price)
            return res.status(400).send({
                message: 'Invalid price'
            });

        var price = parseInt(req.body.price, 10);
        if (price <= 0) 
            return res.status(400).send({
                message: 'Price cannot be 0 or less'
            });

        if (!req.body.seller || !req.body.seller.name || !req.body.seller.email)
            return res.status(400).send({
                message: 'Invalid seller information'
            });

        var bookCoverUrl = req.body.imageUrl;
        if (!bookCoverUrl)
        {
            bookCoverUrl = 'https://dummyimage.com/300x400/2a2470/ffffff&text='+req.body.title;
        }
        
        var book = {
                'id': numbers.getRandom(),
                'title': req.body.title,
                'author': req.body.author,
                'categoryId': req.body.categoryId,
                'price': req.body.price,
                'seller' : {
                    'name':req.body.seller.name,
                    'email':req.body.seller.email
                },
                'imageUrl': bookCoverUrl
            };

        // insert into mongodb
        mongo.addBook(book, function(newBook) {
            res.json(newBook);
        });
    });

    router.delete('/', (req, res) => {
        if (!req.query.id){
            return res.status(400).send({message: 'Category id is missing'});
        }

        console.log(req.query.id);
        mongo.deleteCategory(req.query.id, function(result) {
            res.send({message: 'Category is deleted'});
        });
    });

    return router;
};