const Teacher = require('../../models/teacherModel');

const updateTeacher = async (req, res) => {
    const { name, gender, dob, contactDetails, salary, assignedClass } = req.body;
    const teacher = await Teacher.findById(req.params.id);

    if (teacher) {
        teacher.name = name;
        teacher.gender = gender;
        teacher.dob = dob;
        teacher.contactDetails = contactDetails;
        teacher.salary = salary;
        teacher.assignedClass = assignedClass;

        const updatedTeacher = await teacher.save();
        res.json(updatedTeacher);
    } else {
        res.status(404).json({ message: 'Teacher not found' });
    }
};

module.exports = {
    updateTeacher,
};