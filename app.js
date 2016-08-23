'strict mode';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
var app = express();
const server = http.createServer(app);
var io = require('socket.io')(server);
const Symbol = require('./models/Symbol');

const port = process.env.PORT || 3000;
var routes = require('./routes/index');
//configure mongoose
mongoose.connect("mongodb://localhost:27017/stockMarket");
const db = mongoose.connection;
mongoose.Promise = global.Promise;


io.sockets.on('connection', (socket)=>{
    Symbol.find({}, (err, stocks)=>{
    if(err) return next(err);
    io.emit('display charts', { stocks : stocks});
  });
  socket.on('add stock', (stock)=>{
    Symbol.findOneAndUpdate({
      symbol_name: stock.symbol.toLowerCase()
    },
    { symbol_name: stock.symbol.toLowerCase()},
    {upsert: true},
    (err, done)=>{
      if(err) throw err;
      Symbol.find({}, (err, stocks)=>{
        if(err) throw err;
        io.emit('display charts', { stocks: stocks});
      });
    }
    )
  });
  socket.on('delete stock', (id)=>{
    Symbol.remove({ symbol_name: id.id.toLowerCase()}, (callback)=>{
      Symbol.find({}, (err, stocks)=>{
          if(err) throw err;
          console.log(stocks);
          io.emit('display charts', { stocks: stocks});
        });
  });
  })
});





db.on('open', ()=>{
  console.log('Connection to db successfull');
});

db.on('error', (err)=>{
  console.log('Error connecting db');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

server.listen(port);