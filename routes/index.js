const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).redirect('/catalog');
});

module.exports = router;
