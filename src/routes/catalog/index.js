const express = require('express');
const catalogController = require('../../controllers/catalog_controller');

const router = express.Router();

router.get('/', catalogController.index);

module.exports = router;
