const Class = require('../../models/classModel');
const updateClass = async (req, res) => {
    const { name, year, teacher, studentFees, students } = req.body;
    const classData = await Class.findById(req.params.id);

    if (classData) {
        classData.name = name;
        classData.year = year;
        classData.teacher = teacher;
        classData.studentFees = studentFees;
        classData.students = students;

        const updatedClass = await classData.save();
        res.json(updatedClass);
    } else {
        res.status(404).json({ message: 'Class not found' });
    }
};

module.exports = {
    updateClass,
};