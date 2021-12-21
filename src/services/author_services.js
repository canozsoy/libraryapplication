const authorAccess = require('../db_access/author_access');
const bookAccess = require('../db_access/book_access');

const authorList = async () => authorAccess.findAllAuthors();

const getAuthorDetails = async (id) => {
    const [author, authorBooks] = await Promise.all([
        authorAccess.getAuthorById(id),
        bookAccess.findBookByQuery({ author: id }, 'title summary'),
    ]);

    if (!author) {
        const error = new Error('Author not found');
        error.status = 404;
        throw error;
    }

    return { author, authorBooks };
};

const authorCreatePost = async (body) => authorAccess.createAuthor(body);

const getAuthorDeletePage = async (id) => getAuthorDetails(id);

const deleteAuthor = async (id) => {
    const { author, authorBooks } = await getAuthorDetails(id);

    if (authorBooks.length > 0) {
        throw {
            message: 'EXISTING USER',
            author,
            authorBooks,
        };
    }

    await authorAccess.findAndDeleteAuthorById(id);
};

const authorUpdateGet = async (id) => authorAccess.getAuthorById(id);

const authorUpdatePost = async (id, body) => authorAccess.updateAuthor(id, body);

module.exports = {
    authorList,
    getAuthorDetails,
    authorCreatePost,
    getAuthorDeletePage,
    authorUpdateGet,
    deleteAuthor,
    authorUpdatePost,
};
