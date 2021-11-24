const { DateTime } = require('luxon');

function getUrl() {
    return `/catalog/book-instance/${this.id}`;
}

function getDueBackFormatted() {
    return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
}

function getDueBackRaw() {
    return DateTime.fromJSDate(this.due_back).toISODate();
}

module.exports = {
    getUrl,
    getDueBackFormatted,
    getDueBackRaw,
};
