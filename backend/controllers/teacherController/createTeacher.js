const Teacher = require('../../models/teacherModel');
const createTeacher = async (req, res) => {
    const { name, gender, dob, contactDetails, salary, assignedClass } = req.body;
    const newTeacher = new Teacher({ name, gender, dob, contactDetails, salary, assignedClass });
    const createdTeacher = await newTeacher.save();
    res.status(201).json(createdTeacher);
};

module.exports = {
    createTeacher,
};