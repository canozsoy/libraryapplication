const express = require('express');
const bookInstanceSchemas = require('../../schemas/book_instance_schemas');
const bookInstanceValidations = require('../../middlewares/bookinstance_validation');
const bookInstanceController = require('../../controllers/book_instance_controller');

const router = express.Router();

router.route('/create')
    .get(bookInstanceController.bookInstanceCreateGet)
    .post(
        bookInstanceSchemas.createPost,
        bookInstanceValidations.createPost,
        bookInstanceController.bookInstanceCreatePost,
    );

router.route('/:id/delete')
    .get(bookInstanceController.bookInstanceDeleteGet)
    .post(bookInstanceController.bookInstanceDeletePost);

router.route('/:id/update')
    .get(bookInstanceController.bookInstanceUpdateGet)
    .post(
        bookInstanceSchemas.updatePost,
        bookInstanceValidations.updatePost,
        bookInstanceController.bookInstanceUpdatePost,
    );

router.get('/:id', bookInstanceController.bookInstanceDetail);

router.get('/', bookInstanceController.bookInstanceList);

module.exports = router;
