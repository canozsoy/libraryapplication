const BookInstance = require('../models/bookinstance');

const createBookInstance = async (body) => {
    const newBookInstance = new BookInstance(body);
    await newBookInstance.save();
    return newBookInstance;
};

const findAllBookInstances = async (populate) => BookInstance.find({})
    .populate(populate)
    .exec();

const findBookInstanceById = async (id, populate) => BookInstance.findById(id)
    .populate(populate)
    .exec();

const findBookInstanceByQuery = async (query, select) => BookInstance.find(query, select).exec();

const findAndRemoveBookInstanceById = async (id) => BookInstance.findByIdAndRemove(id).exec();

const findAndUpdateBookInstanceById = async (id, body) => BookInstance
    .findByIdAndUpdate(id, body, {});

module.exports = {
    createBookInstance,
    findAllBookInstances,
    findBookInstanceById,
    findBookInstanceByQuery,
    findAndRemoveBookInstanceById,
    findAndUpdateBookInstanceById,
};
