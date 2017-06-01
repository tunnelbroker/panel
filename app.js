var express = require('express');
var cookieSession = require('cookie-session');
var app = express();

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(cookieSession({
  name: 'session',
  keys: [ 'asdf' ],
  maxAge: 24 * 60 * 60 * 1000
}));

var config = {
  'sitename' : 'Tunnelbroker'
};

app.get('/login/', function(req, res) {
  res.render('login', config);
});

app.get('/', function(req, res) {
  if(!req.session.user_email) {
    res.redirect('/login/');
  }
});

app.listen(3000, function() {
  console.log('Tunnelbroker panel is now listening on Port 3000.');
});