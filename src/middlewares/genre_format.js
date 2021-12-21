const genreFormat = (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
        if (typeof req.body.genre === 'undefined') {
            req.body.genre = [];
        } else {
            req.body.genre = new Array(req.body.genre);
        }
    }
    next();
};

module.exports = genreFormat;
