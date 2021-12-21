const genreServices = require('../services/genre_services');

// Display list of all Genre.
const genreList = async (req, res, next) => {
    let genre;

    try {
        genre = await genreServices.genreList();
    } catch (err) {
        return next(err);
    }

    return res.render('genre_list', {
        title: 'Genre List',
        genre_list: genre,
    });
};

// Display detail page for a specific Genre.
const genreDetail = async (req, res, next) => {
    const { id } = req.params;

    let genre;
    let genreBooks;
    try {
        ({ genre, genreBooks } = await genreServices.genreDetail(id));
    } catch (err) {
        return next(err);
    }

    return res.render('genre_detail', {
        title: 'Genre Detail',
        genre,
        genre_books: genreBooks,
    });
};

// Display Genre create form on GET.
const genreCreateGet = (req, res) => res.render('genre_form', { title: 'Create Genre' });

// Handle Genre create on POST.
const genreCreatePost = async (req, res, next) => {
    const { body } = req;
    let newGenre;

    try {
        newGenre = await genreServices.genreCreatePost(body);
    } catch (err) {
        if (err.message === 'GENRE_EXISTS') {
            return res.redirect(err.foundGenre.url);
        }
        return next(err);
    }

    return res.redirect(newGenre.url);
};

// Display Genre delete form on GET.
const genreDeleteGet = async (req, res) => {
    const { id } = req.params;

    let genre;
    let books;
    try {
        ({ genre, genreBooks: books } = await genreServices.genreDeleteGet(id));
    } catch (err) {
        return res.redirect('/catalog/genre');
    }

    return res.render('genre_delete', {
        title: 'Delete Genre',
        genre,
        books,
    });
};

// Handle Genre delete on POST.
const genreDeletePost = async (req, res, next) => {
    const { id } = req.params;

    try {
        await genreServices.genreDeletePost(id);
    } catch (err) {
        if (err.message === 'GENRE_BOOKS_EXISTS') {
            return res.render('genre_delete', {
                title: 'Delete Genre',
                genre: err.genre,
                books: err.genreBooks,
            });
        }
        return next(err);
    }

    return res.redirect('/catalog/genre');
};

// Display Genre update form on GET.
const genreUpdateGet = async (req, res, next) => {
    const { id } = req.params;
    let genre;

    try {
        genre = await genreServices.genreUpdateGet(id);
    } catch (err) {
        return next(err);
    }

    return res.render('genre_form', {
        title: 'Update Genre',
        genre,
    });
};

// Handle Genre update on POST.
const genreUpdatePost = async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    let updatedGenre;
    try {
        updatedGenre = await genreServices.genreUpdatePost(id, body);
    } catch (err) {
        return next(err);
    }

    return res.redirect(updatedGenre.url);
};

module.exports = {
    genreList,
    genreDetail,
    genreCreateGet,
    genreCreatePost,
    genreDeleteGet,
    genreDeletePost,
    genreUpdateGet,
    genreUpdatePost,
};
