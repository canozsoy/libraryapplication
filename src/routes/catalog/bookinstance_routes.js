const express = require('express');
const bookInstanceController = require('../../controllers/book_instance_controller');

const router = express.Router();

router.route('/create')
    .get(bookInstanceController.bookInstanceCreateGet)
    .post(bookInstanceController.bookInstanceCreatePost);

router.route('/:id/delete')
    .get(bookInstanceController.bookInstanceDeleteGet)
    .post(bookInstanceController.bookInstanceDeletePost);

router.route('/:id/update')
    .get(bookInstanceController.bookInstanceUpdateGet)
    .post(bookInstanceController.bookInstanceUpdatePost);

router.get('/:id', bookInstanceController.bookInstanceDetail);

router.get('/', bookInstanceController.bookInstanceList);

module.exports = router;
