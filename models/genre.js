const mongoose = require('mongoose');

const { Schema } = mongoose;

const GenreSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 100,
        },
    },
);

function getUrl() {
    return `/catalog/genre/${this.id}`;
}

GenreSchema
    .virtual('url')
    .get(getUrl);

module.exports = mongoose.model('Genre', GenreSchema);
