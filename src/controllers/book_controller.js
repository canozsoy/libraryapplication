const bookServices = require('../services/book_services');

// Display list of all books.
const bookList = async (req, res, next) => {
    let book;

    try {
        book = await bookServices.findAllBooks();
    } catch (err) {
        return next(err);
    }

    return res.render('book_list', { title: 'Book List', book_list: book });
};

// Display detail page for a specific book.
const bookDetail = async (req, res, next) => {
    const { id } = req.params;

    let book;
    let bookInstance;
    try {
        ({ book, bookInstance } = await bookServices.getBookDetail(id));
    } catch (err) {
        return next(err);
    }

    return res.render('book_detail', {
        title: book.title,
        book,
        book_instances: bookInstance,
    });
};

// Display book create form on GET.
const bookCreateGet = async (req, res, next) => {
    let authors;
    let genres;

    try {
        ({ authors, genres } = await bookServices.bookCreateGet());
    } catch (err) {
        return next(err);
    }

    return res.render('book_form', {
        title: 'Create Book',
        authors,
        genres,
    });
};

// Handle book create on POST.
const bookCreatePost = async (req, res, next) => {
    const { body } = req;

    let newBook;
    try {
        newBook = await bookServices.createBook(body);
    } catch (err) {
        return next(err);
    }
    return res.redirect(newBook.url);
};

// Display book delete form on GET.
const bookDeleteGet = async (req, res) => {
    const { id } = req.params;

    let book;
    let bookInstance;
    try {
        ({ book, bookInstance } = await bookServices.bookDeleteGet(id));
    } catch (err) {
        return res.redirect('/catalog/book');
    }

    return res.render('book_delete', {
        title: 'Delete Book',
        book,
        book_instances: bookInstance,
    });
};

// Handle book delete on POST.
const bookDeletePost = async (req, res) => {
    const { id } = req.params;

    try {
        await bookServices.deleteBookPost(id);
    } catch (err) {
        return res.render('book_delete', {
            title: 'Delete Book',
            book: err.book,
            book_instances: err.bookInstance,
        });
    }

    return res.redirect('/catalog/book');
};

// Display book update form on GET.
const bookUpdateGet = async (req, res, next) => {
    // Get book, authors and genres for form.
    const { id } = req.params;

    let book;
    let authors;
    let genres;
    try {
        ({ book, authors, genres } = await bookServices.bookUpdateGet(id));
    } catch (err) {
        return next(err);
    }

    return res.render('book_form', {
        title: 'Update Book',
        authors,
        genres,
        book,
    });
};

// Handle book update on POST.
const bookUpdatePost = async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    let updatedBook;
    try {
        updatedBook = await bookServices.bookUpdatePost(id, body);
    } catch (err) {
        return next(err);
    }

    return res.redirect(updatedBook.url);
};

module.exports = {
    bookList,
    bookDetail,
    bookCreateGet,
    bookCreatePost,
    bookDeleteGet,
    bookDeletePost,
    bookUpdateGet,
    bookUpdatePost,
};
