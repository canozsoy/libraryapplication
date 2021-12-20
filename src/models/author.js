const mongoose = require('mongoose');
const authorVirtual = require('./virtuals/author_virtual');

const { Schema } = mongoose;

const AuthorSchema = new Schema(
    {
        first_name: {
            type: String,
            required: true,
            maxlength: 100,
        },
        family_name: {
            type: String,
            required: true,
            maxlength: 100,
        },
        date_of_birth: {
            type: Date,
        },
        date_of_death: {
            type: Date,
        },
    },
);

// Virtual for author

AuthorSchema
    .virtual('name')
    .get(authorVirtual.getName);
AuthorSchema
    .virtual('lifespan')
    .get(authorVirtual.getLifespan);
AuthorSchema
    .virtual('url')
    .get(authorVirtual.getUrl);
AuthorSchema
    .virtual('dateOfBirthFormatted')
    .get(authorVirtual.getDateOfBirthFormatted);
AuthorSchema
    .virtual('dateOfDeathFormatted')
    .get(authorVirtual.getDateOfDeathFormatted);
AuthorSchema
    .virtual('dateOfBirthRaw')
    .get(authorVirtual.getDateOfBirth);
AuthorSchema
    .virtual('dateOfDeathRaw')
    .get(authorVirtual.getDateOfDeath);

module.exports = mongoose.model('Author', AuthorSchema);
