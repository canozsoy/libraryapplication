const { DateTime } = require('luxon');

function getName() {
    return `${this.family_name}, ${this.first_name}`;
}

function getLifespan() {
    return (this.date_of_birth && this.date_of_death)
        ? (this.date_of_death.getFullYear() - this.date_of_birth.getFullYear()).toString()
        : undefined;
}

function getUrl() {
    return `/catalog/author/${this.id}`;
}

function getDateOfBirthFormatted() {
    return (this.date_of_birth)
        ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
        : '';
}

function getDateOfDeathFormatted() {
    return this.date_of_death
        ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
        : '';
}

function getDateOfBirth() {
    return (this.date_of_birth)
        ? DateTime.fromJSDate(this.date_of_birth).toISODate()
        : undefined;
}

function getDateOfDeath() {
    return (this.date_of_death)
        ? DateTime.fromJSDate(this.date_of_death).toISODate()
        : undefined;
}

module.exports = {
    getName,
    getLifespan,
    getUrl,
    getDateOfBirthFormatted,
    getDateOfDeathFormatted,
    getDateOfBirth,
    getDateOfDeath,
};
