/**
 * Inspiration mix from react qa assignment app and lesson examples.
 */
/**** Repository ****/
const mongo = require('./reusable/mongo');
const numbers = require('./util/numbers');
const bcrypt = require('bcryptjs');         // Used for hashing passwords!

module.exports = (secret, passport, APP_URL) => {
    let express = require('express');
    let router = express.Router();

    router.post('/register', (req, res) => {
        if (!req.body.username)
            return res.status(400).send({
                message: 'Invalid username'
            });

        if (!req.body.password)
            return res.status(400).send({
                message: 'Invalid password'
            });
        
        var user = {
            'id': numbers.getRandom(),
            'username': req.body.username,
            'password': req.body.password,
            'isAdmin': false
        };
        bcrypt.hash(user.password, 10, function(err, hash) {
            user.hash = hash; // The hash has been made, and is stored on the user object.
            delete user.password; // The clear text password is no longer needed

            // insert into mongodb
            mongo.addUser(user, function(result) {
                console.log(result);
                res.send(result);
            });
         });
    });

    // This route takes a username and a password and create an auth token
    router.post('/authenticate',
        passport.authenticate('local', { session: false }),
        (req, res) => {
            res.json({ token: req.user.token, username: req.user.username, admin: req.user.admin });
        });
   
    return router;
};