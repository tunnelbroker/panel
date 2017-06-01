// Load modules
var express = require('express');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var app = express();
var mysql = require('mysql');
var config = require('./config');

// Initialize modules
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(cookieSession({
  name: 'session',
  keys: [ 'asdf' ],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(bodyParser({
  extended: true
}));
var connection = mysql.createConnection({
  host     : config.mysql_host,
  user     : config.mysql_user,
  password : config.mysql_pass
});
connection.connect();

// Methods
function requireAuth() {
  if(!req.session.email) {
    res.redirect('/login/');
  }
}
function displayError(session) {
  var error = session.error;
  session.error = null;
  if(error == 'user_not_found') {
    return 'User was not found in database.';
  }
}

// Frontend pages
app.get('/', function(req, res) {
  if(!req.session.user_email) {
    res.redirect('/login/');
  }
});
app.get('/login/', function(req, res) {
  res.render('login', {
    config: config,
    error: displayError(req.session)
  });
});

// Backend
app.post('/api/login/', function(req, res) {
  connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [req.body.email, sha256(req.body.password)], function(err, results, fields) {
    if(!results) {
      req.session.error = 'user_not_found';
      res.redirect('/login/');
    }
  });
});

// Listen
app.listen(3000, function() {
  console.log('Tunnelbroker panel is now listening on Port 3000.');
});