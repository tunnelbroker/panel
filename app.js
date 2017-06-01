// Load modules
var express = require('express');
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
var connection = mysql.createConnection({
  host     : config.mysql_host,
  user     : config.mysql_user,
  password : config.mysql_pass
});
connection.connect();

// Frontend pages
app.get('/', function(req, res) {
  if(!req.session.user_email) {
    res.redirect('/login/');
  }
});
app.get('/login/', function(req, res) {
  res.render('login', config);
});

// Backend
app.post('/api/login/', function(req, res) {
  
});

// Listen
app.listen(3000, function() {
  console.log('Tunnelbroker panel is now listening on Port 3000.');
});