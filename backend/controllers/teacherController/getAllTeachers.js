const Teacher = require('../../models/teacherModel');

const getTeachers = async (req, res) => {
    const teachers = await Teacher.find().populate('assignedClass');
    res.json(teachers);
};

module.exports = {
    getTeachers,
};