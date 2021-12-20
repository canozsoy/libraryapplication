const express = require('express');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const connectDB = require('./src/models/config');
const errorHandler = require('./src/middlewares/error_handler');
require('dotenv').config();

const indexRouter = require('./src/routes/index');
const catalogRouter = require('./src/routes/catalog');
const notFoundRouter = require('./src/routes/not_found');

const app = express();

// MongoDB
(async () => {
    await connectDB();
})();

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(helmet());
app.use(compression());

// Routes

app.use('/', indexRouter);
app.use('/catalog', catalogRouter);
app.use('*', notFoundRouter);

// error handler

app.use(errorHandler);

app.listen(process.env.PORT || 3000);

module.exports = app;
