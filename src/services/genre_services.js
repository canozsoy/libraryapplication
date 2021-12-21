const genreAccess = require('../db_access/genre_access');
const bookAccess = require('../db_access/book_access');

const genreList = async () => genreAccess.findAllGenres();

const genreDetail = async (id) => {
    const [genre, genreBooks] = await Promise.all([
        genreAccess.findGenreById(id),
        bookAccess.findBookByQuery({ genre: id }, {}),
    ]);

    if (!genre) {
        const err = new Error('Genre not found');
        err.status = 404;
        throw err;
    }

    return { genre, genreBooks };
};

const genreCreatePost = async (body) => {
    const foundGenre = await genreAccess.foundOneByQuery({ name: body.name });

    if (foundGenre) {
        throw {
            message: 'GENRE_EXISTS',
            foundGenre,
        };
    }

    return genreAccess.createGenre(body);
};

const genreDeleteGet = async (id) => genreDetail(id);

const genreDeletePost = async (id) => {
    const { genre, genreBooks } = await genreDetail(id);

    if (genreBooks.length > 0) {
        throw {
            message: 'GENRE_BOOKS_EXISTS',
            genre,
            genreBooks,
        };
    }

    await genreAccess.findAndDeleteGenreById(id);
};

const genreUpdateGet = async (id) => genreAccess.findGenreById(id);

const genreUpdatePost = async (id, body) => genreAccess.findAndUpdateGenreById(id, body);

module.exports = {
    genreList,
    genreDetail,
    genreCreatePost,
    genreDeleteGet,
    genreDeletePost,
    genreUpdateGet,
    genreUpdatePost,
};
