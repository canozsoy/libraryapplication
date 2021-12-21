const Genre = require('../models/genre');

const findAllGenres = () => Genre.find().exec();

module.exports = {
    findAllGenres,
};
