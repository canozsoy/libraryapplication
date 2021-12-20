const authorServices = require('../services/author_services');

const authorList = async (req, res, next) => {
    let authors;
    try {
        authors = await authorServices.findAllAuthors();
    } catch (err) {
        return next(err);
    }
    return res.render('author_list', { title: 'Author List', author_list: authors });
};

const authorDetail = async (req, res, next) => {
    const { id } = req.params;

    let author;
    let authorBooks;
    try {
        ({ author, authorBooks } = await authorServices.getAuthorDetails(id));
    } catch (err) {
        return next(err);
    }

    return res.render('author_detail', {
        title: 'Author Detail',
        author,
        author_books: authorBooks,
    });
};

const authorCreateGet = (req, res) => {
    res.render('author_form', { title: 'Create Author' });
};

const authorCreatePost = async (req, res, next) => {
    const { body } = req;

    let author;

    try {
        author = await authorServices.createAuthor(body);
    } catch (err) {
        return next(err);
    }

    return res.redirect(author.url);
};

const authorDeleteGet = async (req, res) => {
    const { id } = req.params;

    let author;
    let authorBooks;
    // Unfortunately response is passed here to service
    try {
        ({ author, authorBooks } = await authorServices.getAuthorDeletePage(id));
    } catch (err) {
        return res.redirect('/catalog/author');
    }

    return res.render('author_delete', {
        title: 'Delete Author',
        author,
        author_books: authorBooks,
    });
};

const authorDeletePost = async (req, res, next) => {
    const { id } = req.params;

    try {
        await authorServices.deleteAuthor(id);
    } catch (err) {
        if (err.message === 'EXISTING USER') {
            return res.render('author_delete', {
                title: 'Delete Author',
                author: err.author,
                author_books: err.authorBooks,
            });
        }
        return next(err);
    }

    return res.redirect('/catalog/author');
};

const authorUpdateGet = async (req, res, next) => {
    const { id } = req.params;

    let author;
    try {
        author = await authorServices.getAuthorById(id);
    } catch (err) {
        return next(err);
    }

    return res.render('author_form', {
        title: 'Update Author',
        author,
    });
};

const authorUpdatePost = async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    let updatedAuthor;

    try {
        updatedAuthor = await authorServices.updateAuthor(id, body);
    } catch (err) {
        return next(err);
    }

    return res.redirect(updatedAuthor.url);
};

module.exports = {
    authorList,
    authorDetail,
    authorCreateGet,
    authorCreatePost,
    authorDeleteGet,
    authorDeletePost,
    authorUpdateGet,
    authorUpdatePost,
};
