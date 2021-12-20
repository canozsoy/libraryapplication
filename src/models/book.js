const mongoose = require('mongoose');

const { Schema } = mongoose;

const BookSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'Author',
            required: true,
        },
        summary: {
            type: String,
            required: true,
        },
        isbn: {
            type: String,
            required: true,
        },
        genre: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Genre',
            },
        ],
    },
);

function getUrl() {
    return `/catalog/book/${this.id}`;
}

// Virtual for book's URL
BookSchema
    .virtual('url')
    .get(getUrl);

// Export model
module.exports = mongoose.model('Book', BookSchema);
