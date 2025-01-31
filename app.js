var express = require('express');
const passport = require('./passport');  
const session = require('express-session');
require('dotenv').config();
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(
  session({
    secret: 'gabgab',  
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const port = process.env.PORT || 3000;
// const port = 3008;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Now connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB connection error:', err));
  
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
