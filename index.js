const express = require('express');
const app = express();
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bodyParser = require('body-parser');

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3000;
app.set('superSecret', 'THIS_IS_SECRET'); // secret variable

app.get('/', function (req, res) {
    res.send('Todo app server');
});

// get an instance of the router for api routes
const router = express.Router();

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function (req, res) {
    const account = req.body.account;
    console.log(account);
    if ("admin" !== account.username || "123456" !== account.password) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
    }
    else {
        // if user is found and password is right
        // create a token
        // not save pass in payload
        account.password = "PASS_IS_NOT_HERE";
        var token = jwt.sign(account, app.get('superSecret'), {
            
            // expiresInMinutes is was deprecated from docs
            // expiresInMinutes: 1440 // expires in 24 hours
            expiresIn : 10
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
    // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'),{ignoreExpiration : true} ,function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;  
        console.log(req.decoded);  
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
  }
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