const Teacher = require('../../models/teacherModel');

const getTeacherById = async (req, res) => {
    const teacher = await Teacher.findById(req.params.id).populate('assignedClass');
    if (teacher) {
        res.json(teacher);
    } else {
        res.status(404).json({ message: 'Teacher not found' });
    }
};

module.exports = {
    getTeacherById,
};