const Student = require('../../models/studentModel');
const createStudent = async (req, res) => {
    const { name, gender, dob, contactDetails, feesPaid } = req.body;
    console.log(req.body);
    const newStudent = new Student({ name, gender, dob, contactDetails, feesPaid });
    const createdStudent = await newStudent.save();
    res.status(201).json(createdStudent);
};

module.exports = {
    createStudent,
};