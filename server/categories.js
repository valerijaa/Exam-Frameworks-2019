module.exports = () => {
    let express = require('express');
    let router = express.Router();
    const numbers = require('./util/numbers');
    const mongo = require('./reusable/mongo');

    router.get('/', (req, res) => {
        mongo.getCategories(function(categories){
            return res.json(categories);
        });
    });

    router.post('/', (req, res) => {
        if (!req.body.name)
            return res.status(400).send({
                message: 'Invalid category name'
            });
        
        var category = {
            'id': numbers.getRandom(),
            'name': req.body.name
        };

        // insert into mongodb
        mongo.addCategory(category, function(newCategory) {
            res.json(newCategory);
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