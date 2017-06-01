// Load modules
var express = require('express');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var mysql = require('mysql');
var crypto = require('crypto');
var app = express();
var config = require('./config');

// Initialize modules
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(cookieSession({
  name: 'session',
  keys: [ 'asdf' ],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
var connection = mysql.createConnection({
  host     : config.mysql_host,
  user     : config.mysql_user,
  password : config.mysql_pass,
  database : config.mysql_db
});
connection.connect();

// Methods
function requireAuth(req, res) {
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
function defaultRender(res, req, page) {
  var content = "";
  app.render('header', {
    config: config,
    error: displayError(req.session),
    page: page
  }, function(err, html) {
    content += html;         
  });
  app.render('navbar', {
    config: config,
    error: displayError(req.session),
    page: page
  }, function(err, html) {
    content += html;         
  });
  app.render(page, {
    config: config,
    error: displayError(req.session),
    page: page
  }, function(err, html) {
    content += html;         
  });
  app.render('footer', {
    config: config,
    error: displayError(req.session),
    page: page
  }, function(err, html) {
    content += html;         
  });
  res.end(content);
}

// Frontend pages
app.get('/', function(req, res) {
  requireAuth(req, res);
  defaultRender(res, req, 'Home');
});
app.get('/login/', function(req, res) {
  res.render('login', {
    config: config,
    error: displayError(req.session)
  });
});

// Backend
app.post('/api/login/', function(req, res) {
  connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [req.body.email, crypto.createHash('sha256').update(req.body.password).digest('base64')], function(err, results, fields) {
    if(!results[0]) {
      req.session.error = 'user_not_found';
      res.redirect('/login/');
    } else {
      req.session.email = req.body.email;
      res.redirect('/');
    }
  });
});
app.get('/api/logout/', function(req, res) {
  req.session.email = null;
  res.redirect('/login/');
})

// Listen
app.listen(3000, function() {
  console.log('Tunnelbroker panel is now listening on Port 3000.');
});