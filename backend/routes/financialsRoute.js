const express = require('express');
const { financials } = require('../controllers/financials');


const router = express.Router();

router.route('/financials').get(financials);


module.exports = router;
