const mongoose = require('mongoose');
const bookInstanceVirtual = require('./virtuals/book_instance_virtual');

const { Schema } = mongoose;

const BookInstanceSchema = new Schema(
    {
        book: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
        imprint: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
            default: 'Maintenance',
        },
        due_back: {
            type: Date,
            default: Date.now,
        },
    },
);

// Virtual for book instance
BookInstanceSchema
    .virtual('url')
    .get(bookInstanceVirtual.getUrl);

BookInstanceSchema
    .virtual('dueBackFormatted')
    .get(bookInstanceVirtual.getDueBackFormatted);

BookInstanceSchema
    .virtual('dueBackRaw')
    .get(bookInstanceVirtual.getDueBackRaw);

// Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);
