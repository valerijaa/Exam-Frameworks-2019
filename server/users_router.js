module.exports = (secret, passport, APP_URL) => {
    let express = require('express');
    let router = express.Router();

    router.post('/', (req, res) => {
        // TODO: Implement user account creation
        res.status(501).json({msg: "POST new user not implemented"});
    });

    router.put('/', (req, res) => {
        // TODO: Implement user update (change password, etc).
        res.status(501).json({msg: "PUT update user not implemented"});
    });

    // This route takes a username and a password and create an auth token
    router.post('/authenticate',
        passport.authenticate('local', { session: false }),
        (req, res) => {
            res.json({ token: req.user.token, username: req.user.username });
        });

   
    return router;
};