const express = require('express');
const httpError = require('http-errors');

const router = express.Router();

router.all((req, res, next) => {
    next(httpError(404));
});

module.exports = router;
