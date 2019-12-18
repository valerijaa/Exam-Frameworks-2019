module.exports = () => {
    let express = require('express');
    let router = express.Router();
    const numbers = require('./util/numbers');
    const mongo = require('./reusable/mongo');

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
        if (req.query.id) {
            mongo.getBook(req.query.id, function(book){
                return res.json(book);
            });
        }
        else {
            mongo.getBooks(function(books){
                return res.json(books);
            });
        }
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

        if (!req.body.imageUrl)
            return res.status(400).send({
                message: 'Invalid image'
            });
        
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
                'imageUrl': req.body.imageUrl
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