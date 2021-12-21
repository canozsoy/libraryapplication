const Genre = require('../models/genre');

const findAllGenres = async () => Genre.find([['name', 'ascending']]).exec();

const findGenreById = async (id) => Genre.findById(id).exec();

const foundOneByQuery = async (query) => Genre.findOne(query).exec();

const createGenre = async (body) => {
    const newGenre = new Genre(body);
    await newGenre.save();
    return newGenre;
};

const findAndDeleteGenreById = async (id) => Genre.findByIdAndRemove(id);

const findAndUpdateGenreById = async (id, body) => Genre.findByIdAndUpdate(id, body);

module.exports = {
    findAllGenres,
    findGenreById,
    foundOneByQuery,
    createGenre,
    findAndDeleteGenreById,
    findAndUpdateGenreById,
};
