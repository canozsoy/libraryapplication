const bookInstanceServices = require('../services/bookinstance_services');

// Display list of all BookInstances.
const bookInstanceList = async (req, res, next) => {
    let bookInstances;

    try {
        bookInstances = await bookInstanceServices.bookInstanceList();
    } catch (err) {
        return next(err);
    }

    return res.render('bookinstance_list', {
        title: 'Book Instance List',
        bookinstance_list: bookInstances,
    });
};

// Display detail page for a specific BookInstance.
const bookInstanceDetail = async (req, res, next) => {
    const { id } = req.params;

    let bookInstance;
    try {
        bookInstance = await bookInstanceServices.bookInstanceDetail(id);
    } catch (err) {
        return next(err);
    }

    return res.render('bookinstance_detail', {
        title: `Copy: ${bookInstance.book.title}`,
        bookinstance: bookInstance,
    });
};

// Display BookInstance create form on GET.
const bookInstanceCreateGet = async (req, res, next) => {
    let book;
    try {
        book = await bookInstanceServices.bookInstanceCreateGet();
    } catch (err) {
        return next(err);
    }

    return res.render('bookinstance_form', {
        title: 'Create BookInstance',
        book_list: book,
    });
};

// Handle BookInstance create on POST.
const bookInstanceCreatePost = async (req, res, next) => {
    const { body } = req;

    let newBookInstance;
    try {
        newBookInstance = await bookInstanceServices.bookInstanceCreatePost(body);
    } catch (err) {
        return next(err);
    }

    return res.redirect(newBookInstance.url);
};

// Display BookInstance delete form on GET.
const bookInstanceDeleteGet = async (req, res) => {
    const { id } = req.params;

    let book;
    let imprint;
    try {
        ({ book, imprint } = await bookInstanceServices.bookInstanceDeleteGet(id));
    } catch (err) {
        return res.redirect('/catalog/book-instance');
    }

    return res.render('bookinstance_delete', {
        title: 'Delete Book Instance',
        book,
        imprint,
    });
};

// Handle BookInstance delete on POST.
const bookInstanceDeletePost = async (req, res, next) => {
    const { id } = req.params;

    try {
        await bookInstanceServices.bookInstanceDeletePost(id);
    } catch (err) {
        return next(err);
    }

    return res.redirect('/catalog/book-instance');
};

// Display BookInstance update form on GET.
const bookInstanceUpdateGet = async (req, res, next) => {
    const { id } = req.params;

    let bookInstance;
    let book;
    try {
        ({ bookInstance, book } = await bookInstanceServices.bookInstanceUpdateGet(id));
    } catch (err) {
        return next(err);
    }

    return res.render('bookinstance_form', {
        title: 'Update Book Instance',
        book_list: book,
        bookinstance: bookInstance,
    });
};

// Handle bookinstance update on POST.
const bookInstanceUpdatePost = async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;

    let updatedBookInstance;

    try {
        updatedBookInstance = await bookInstanceServices.bookInstanceUpdatePost(id, body);
    } catch (err) {
        return next(err);
    }

    return res.redirect(updatedBookInstance.url);
};

module.exports = {
    bookInstanceList,
    bookInstanceDetail,
    bookInstanceCreateGet,
    bookInstanceCreatePost,
    bookInstanceDeleteGet,
    bookInstanceDeletePost,
    bookInstanceUpdateGet,
    bookInstanceUpdatePost,
};
