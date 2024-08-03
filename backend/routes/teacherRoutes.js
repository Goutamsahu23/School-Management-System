const express = require('express');
const { getTeachers } = require('../controllers/teacherController/getAllTeachers');
const { getTeacherById } = require('../controllers/teacherController/getTeacherById')
const { createTeacher } = require('../controllers/teacherController/createTeacher')
const { updateTeacher } = require('../controllers/teacherController/updateTeacher')
const { deleteTeacher } = require('../controllers/teacherController/deleteTeacher')

const router = express.Router();

router.route('/').get(getTeachers).post(createTeacher);
router
    .route('/:id')
    .get(getTeacherById)
    .put(updateTeacher)
    .delete(deleteTeacher);

module.exports = router;
