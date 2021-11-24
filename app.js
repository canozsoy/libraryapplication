const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const connectDB = require('./models/config');
const errorHandler = require('./strategies/error_handler');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');
const notFoundRouter = require('./routes/not_found');

const app = express();

// MongoDB
(async () => {
    await connectDB();
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(compression());

// Routes

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);
app.use('*', notFoundRouter);

// error handler

app.use(errorHandler);

module.exports = app;
