var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 1337;

var routes = require('./server/routes/index');

var app = express();

app.use('/api/v1', routes);

app.use(function(req, res, next){
  var err = new Error('Not found');
  err.status = 404;
  next(err);
});

app.listen(port, function(){
  console.log('Server listening on port ' + port);
});
