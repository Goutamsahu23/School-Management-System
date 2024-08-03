const Student = require('../../models/studentModel');
const deleteStudent = async (req, res) => {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (student) {
        res.json({ message: 'Student removed' });
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
};

module.exports = {
    deleteStudent,
};