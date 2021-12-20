const Author = require('../models/author');
const bookServices = require('./book_services');

const findAllAuthors = async () => Author.find()
    .sort([['family_name', 'ascending']])
    .exec();

const getAuthorById = async (id) => Author.findById(id).exec();

const getAuthorDetails = async (id) => {
    const [author, authorBooks] = await Promise.all([
        getAuthorById(id),
        bookServices.findBookByAuthorId(id),
    ]);

    if (!author) {
        const error = new Error('Author not found');
        error.status = 404;
        throw error;
    }

    return { author, authorBooks };
};

const createAuthor = async (body) => {
    const author = new Author(body);
    await author.save();
    return author;
};

const getAuthorDeletePage = async (id) => getAuthorDetails(id);

const findAndDeleteAuthorById = (id) => Author.findByIdAndRemove(id).exec();

const updateAuthor = async (id, body) => Author.findByIdAndUpdate(id, body, {})
    .exec();

const deleteAuthor = async (id) => {
    const { author, authorBooks } = await getAuthorDetails(id);

    if (authorBooks.length > 0) {
        throw {
            message: 'EXISTING USER',
            author,
            authorBooks,
        };
    }

    await findAndDeleteAuthorById(id);
};

module.exports = {
    findAllAuthors,
    getAuthorDetails,
    createAuthor,
    getAuthorDeletePage,
    deleteAuthor,
    getAuthorById,
    updateAuthor,
};
