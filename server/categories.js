module.exports = () => {
    let express = require('express');
    let router = express.Router();
    const numbers = require('./util/numbers');
    const mongo = require('./reusable/mongo');
    
    router.get('/', (req, res) => {
        if (req.query.id) {
            mongo.getCategory(req.query.id, function(category){
                return res.json(category);
            });
        }
        else {
            mongo.getCategories(function(categories){
                return res.json(categories);
            });
        }
        
    });
    
    router.get('/by-normalized-name', (req, res) => {
        mongo.getCategoryByName(req.query.name, function(category){
            return res.json(category);
        });
    });

    router.post('/', (req, res) => {
        if (req.user.admin === false) {
            return res.status(403).send({
                message: 'Only admins are allowed to create a category'
            });
        }

        if (!req.body.name)
            return res.status(400).send({
                message: 'Invalid category name'
            });
        
        var category = {
            'id': numbers.getRandom(),
            'name': req.body.name,
            'description': req.body.description
        };

        // insert into mongodb
        mongo.addCategory(category, function(newCategory) {
            res.json(newCategory);
        });
    });

    router.delete('/', (req, res) => {
        if (req.user.admin === false) {
            return res.status(403).send({
                message: 'Only admins are allowed to delete a category'
            });
        }

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