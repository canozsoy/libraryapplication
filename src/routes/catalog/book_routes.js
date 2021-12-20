const express = require('express');
const bookController = require('../../controllers/book_controller');

const router = express.Router();

router.route('/create')
    .get(bookController.bookCreateGet)
    .post(bookController.bookCreatePost);

router.route('/:id/delete')
    .get(bookController.bookDeleteGet)
    .post(bookController.bookDeletePost);

router.route('/:id/update')
    .get(bookController.bookUpdateGet)
    .post(bookController.bookUpdatePost);

router.get('/:id', bookController.bookDetail);

router.get('/', bookController.bookList);

module.exports = router;
