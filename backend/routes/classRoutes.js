const express = require('express');
const { createClass } = require('../controllers/classController/createClass');
const { getClasses } = require('../controllers/classController/getAllClasses')
const { getClassById } = require('../controllers/classController/getClassById')
const { updateClass } = require('../controllers/classController/updateClass')
const { deleteClass } = require('../controllers/classController/deleteClass')

const router = express.Router();

router.route('/').get(getClasses).post(createClass);
router
    .route('/:id')
    .get(getClassById)
    .put(updateClass)
    .delete(deleteClass);

module.exports = router;
