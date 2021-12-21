const express = require('express');
const genreSchemas = require('../../schemas/genre_schemas');
const genreValidations = require('../../middlewares/genre_validation');
const genreController = require('../../controllers/genre_controller');

const router = express.Router();

router.route('/create')
    .get(genreController.genreCreateGet)
    .post(
        genreSchemas.createPost,
        genreValidations.createPost,
        genreController.genreCreatePost,
    );

router.route('/:id/delete')
    .get(genreController.genreDeleteGet)
    .post(genreController.genreDeletePost);

router.route('/:id/update')
    .get(genreController.genreUpdateGet)
    .post(
        genreSchemas.updatePost,
        genreValidations.updatePost,
        genreController.genreUpdatePost,
    );

router.get('/:id', genreController.genreDetail);

router.get('/', genreController.genreList);

module.exports = router;
