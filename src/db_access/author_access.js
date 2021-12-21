const Author = require('../models/author');

const createAuthor = async (body) => {
    const author = new Author(body);
    await author.save();
    return author;
};

const findAllAuthors = async () => Author.find()
    .sort([['family_name', 'ascending']])
    .exec();

const getAuthorById = async (id) => Author.findById(id).exec();

const findAndDeleteAuthorById = (id) => Author.findByIdAndRemove(id).exec();

const updateAuthor = async (id, body) => Author.findByIdAndUpdate(id, body, {})
    .exec();

module.exports = {
    createAuthor,
    findAllAuthors,
    getAuthorById,
    findAndDeleteAuthorById,
    updateAuthor,
};
