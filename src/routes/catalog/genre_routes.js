const express = require('express');
const genreController = require('../../controllers/genre_controller');

const router = express.Router();

router.route('/create')
    .get(genreController.genreCreateGet)
    .post(genreController.genreCreatePost);

router.route('/:id/delete')
    .get(genreController.genreDeleteGet)
    .post(genreController.genreDeletePost);

router.route('/:id/update')
    .get(genreController.genreUpdateGet)
    .post(genreController.genreUpdatePost);

router.get('/:id', genreController.genreDetail);

router.get('/', genreController.genreList);

module.exports = router;
