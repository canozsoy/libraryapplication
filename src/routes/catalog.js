const express = require('express');

const router = express.Router();

const indexRoute = require('./catalog/index');
const bookRoutes = require('./catalog/book_routes');
const authorRoutes = require('./catalog/author_routes');
const genreRoutes = require('./catalog/genre_routes');
const bookInstanceRoutes = require('./catalog/bookinstance_routes');

// Catalog route
router.use('/', indexRoute);

router.use('/author', authorRoutes);

router.use('/book', bookRoutes);

router.use('/genre', genreRoutes);

router.use('/book-instance', bookInstanceRoutes);

module.exports = router;
