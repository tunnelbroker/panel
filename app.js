var express = require('express');
var app = express();
app.set('view engine', 'pug');

app.get('/login/', function() {
  res.render('login');
});

app.listen(3000, function() {
  console.log('Tunnelbroker panel is now listening on Port 3000.');
});