
const Student = require('../../models/studentModel');
const getStudentById = async (req, res) => {
    const student = await Student.findById(req.params.id).populate('class');
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
};

module.exports = {
    getStudentById,
};