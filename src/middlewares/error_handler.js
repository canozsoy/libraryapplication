const errorHandler = (err, req, res, next) => {
    if (res.sentHeaders) {
        return next(err);
    }
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    return res.render('error');
};

module.exports = errorHandler;
