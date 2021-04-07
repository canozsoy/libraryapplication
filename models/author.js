var mongoose = require('mongoose');
let {DateTime} = require("luxon");

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
    {
        first_name: {type: String, required: true, maxlength: 100},
        family_name: {type: String, required: true, maxlength: 100},
        date_of_birth: {type: Date},
        date_of_death: {type: Date},
    }
);

// Virtual for author's full name
AuthorSchema
    .virtual('name')
    .get(function () {
        return this.family_name + ', ' + this.first_name;
    });

// Virtual for author's lifespan
AuthorSchema
    .virtual('lifespan')
    .get(function () {
        if ((this.date_of_birth && this.date_of_death))
        return (this.date_of_death.getFullYear() - this.date_of_birth.getFullYear()).toString();
    });

// Virtual for author's URL
AuthorSchema
    .virtual('url')
    .get(function () {
        return '/catalog/author/' + this._id;
    });

AuthorSchema
    .virtual("date_of_birth_formatted")
    .get(function () {
        if (this.date_of_birth) {
            return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
        } else return "";

    });

AuthorSchema
    .virtual("date_of_death_formatted")
    .get(function () {
        if (this.date_of_death) {
            return DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
        } else {
            return "";
        }
    });
AuthorSchema
    .virtual("date_of_death_mm_dd_yyyy")
    .get(function () {
        if (this.date_of_death) {
            return DateTime.fromJSDate(this.date_of_death).toISODate();
        }
    });
AuthorSchema
    .virtual("date_of_birth_mm_dd_yyyy")
    .get(function () {
        if (this.date_of_birth) {
            return DateTime.fromJSDate(this.date_of_birth).toISODate();
        }
    });

//Export model
module.exports = mongoose.model('Author', AuthorSchema);

