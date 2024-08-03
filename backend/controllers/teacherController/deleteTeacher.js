const Teacher = require('../../models/teacherModel');

const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        
        if (teacher) {
            res.json({ message: 'Teacher removed' });
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting teacher', error });
    }
};

module.exports = {
    deleteTeacher,
};
