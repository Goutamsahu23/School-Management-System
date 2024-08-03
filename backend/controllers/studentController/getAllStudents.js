const Student = require('../../models/studentModel');
const getStudents = async (req, res) => {
    const students = await Student.find().populate('class');
    res.json(students);
};

module.exports = {
    getStudents,
};