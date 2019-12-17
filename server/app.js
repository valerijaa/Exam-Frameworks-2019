/**** Libraries ****/
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const session = require('express-session'); // Only needed for some passport strategies
const checkJwt = require('express-jwt');    // Check for access tokens automatically
const bcrypt = require('bcryptjs');         // Used for hashing passwords!
const jwt = require('jsonwebtoken');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/**** Repository ****/
const mongo = require('./reusable/mongo');
const seed = require('./util/seed');

/**** Configuration ****/
const API_URL = process.env.API_URL || 'http://localhost:8080/api';
const APP_URL = process.env.APP_URL || 'http://localhost:3000/';
const port = process.env.PORT || 8080;
const app = express();
const secret = "the cake is a lie";
app.use(cors());
app.use(express.static('../client/build/'));
app.use(bodyParser.json()); // Parse JSON from the request body
app.use(morgan('combined')); // Log all requests to the console
app.use(session({ secret: secret, cookie: { maxAge: 60000 }, resave: false, saveUninitialized: true}));

// seed database
mongo.ensureIsConnected(function() {
    seed.seedDataIfNeeded(mongo);
})

// Configure Passport
passport.use(new LocalStrategy(function(username, password, done) {
    mongo.getCollection('users').findOne({'username': username}, function(err, user) {
        if (err) 
            throw err;
    
        if (!user)
            return done(null, false, { message: 'Incorrect username or password.' });
        
        bcrypt.compare(password, user.hash, (err, result) => {
            if (result) { // If the password matched
                const payload = { username: username, id: user.id, admin: user.isAdmin };
                const token = jwt.sign(payload, secret, { expiresIn: '1h' });
                return done(null, {username: username, token: token});
            }
            return done(null, false, { message: 'Incorrect username or password.' });
        }); 
    });
}));

app.use(passport.initialize());

// Open paths that do not need login. Any route not included here is protected!
let openPaths = [
    { url: /\/api\/users\/authenticate.*/gi, methods: ['POST'] },
    { url: /\/api\/users\/register.*/gi, methods: ['POST'] }
];

// Validate the user using authentication. checkJwt checks for auth token.
app.use(checkJwt({ secret: secret }).unless({ path : openPaths }));

// This middleware checks the result of checkJwt
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') { // If the user didn't authorize correctly
        res.status(401).json({ error: err.message, debug: 'checkJwt' }); // Return 401 with error message.
    } else {
        next(); // If no errors, send request to next middleware or route handler
    }
});

/**** Routes ****/
const usersRouter = require('./users_router')(secret, passport, APP_URL);
app.use('/api/users', usersRouter);

// const kittenRouter = require('./kitten_router')(data);
// app.use('/api/kittens', kittenRouter);

// "Redirect" all get requests (except for the routes specified above) to React's entry point (index.html)
// It's important to specify this route as the very last one to prevent overriding all of the other routes
app.get('*', (req, res) =>
    res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
);

/**** Start ****/
app.listen(port, () => {
    console.log(`Auth Example API running on port ${port}!`)
});
