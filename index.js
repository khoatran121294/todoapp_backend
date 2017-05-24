const express = require('express');
const app = express();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bodyParser = require('body-parser');

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3000;
// app.set('superSecret', 'todos_secret'); // secret variable

app.get('/', function (req, res) {
    res.send('Todo app server');
});

// get an instance of the router for api routes
const router = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function (req, res) {
    const account = req.body.account;

    if ("admin" != account.username || "123456" != account.password) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
    }
    else {
        // if user is found and password is right
        // create a token
        var token = jwt.sign(account, app.get('superSecret'), {
            expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
        });
    }
});

// route middleware to verify a token
router.use(function (req, res, next) {
    console.log('oke');
    // check header or url parameters or post parameters for token
    next();
});

router.get('/', function (req, res) {
    res.send('Prefix /api is authenticated');
});

router.get('/todos', function (req, res) {
    const todos = [
        {
            id: "1",
            time: "06:30",
            content: "Go to school, Go to school, Go to school, Go to school, Go to school, Go to school, Go to school",
            status: "TODO"
        },
        {
            id: "2",
            time: "12:30",
            content: "Play football with friend",
            status: "DOING"
        },
        {
            id: "3",
            time: "12:30",
            content: "Play football with friend",
            status: "COMPLETED"
        }
    ];
    res.json(todos);
});

// apply the routes to our application with the prefix /api
app.use('/api', router);

app.listen(PORT, function () {
    console.log('todo app server listening on port ' + PORT);
});