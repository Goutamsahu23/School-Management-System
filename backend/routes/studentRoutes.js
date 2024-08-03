const express = require('express');
const { getStudents } = require('../controllers/studentController/getAllStudents');
const { getStudentById } = require('../controllers/studentController/getStudentById')
const { createStudent } = require('../controllers/studentController/createStudent')
const { updateStudent } = require('../controllers/studentController/updateStudent')
const { deleteStudent } = require('../controllers/studentController/deleteStudent')

const router = express.Router();

router.route('/').get(getStudents).post(createStudent);
router
    .route('/:id')
    .get(getStudentById)
    .put(updateStudent)
    .delete(deleteStudent);

module.exports = router;
