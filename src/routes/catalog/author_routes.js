const express = require('express');
const authorController = require('../../controllers/author_controller');
const authorSchemas = require('../../schemas/author_schemas');
const authorValidation = require('../../middlewares/author_validation');

const router = express.Router();

router.route('/create')
    .get(authorController.authorCreateGet)
    .post(
        authorSchemas.createPost,
        authorValidation.createPost,
        authorController.authorCreatePost,
    );

router.route('/:id/delete')
    .get(authorController.authorDeleteGet)
    .post(authorController.authorDeletePost);

// GET request to update Author.
router.route('/:id/update')
    .get(authorController.authorUpdateGet)
    .post(
        authorSchemas.updatePost,
        authorValidation.updatePost,
        authorController.authorUpdatePost,
    );

router.get('/:id', authorController.authorDetail);

router.get('/', authorController.authorList);

module.exports = router;
