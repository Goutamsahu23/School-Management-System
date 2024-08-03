const Student = require('../../models/studentModel');
const updateStudent = async (req, res) => {
    const { name, gender, dob, contactDetails, feesPaid, class: classId } = req.body;
    const student = await Student.findById(req.params.id);

    if (student) {
        student.name = name;
        student.gender = gender;
        student.dob = dob;
        student.contactDetails = contactDetails;
        student.feesPaid = feesPaid;
        student.class = classId;

        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
};

module.exports = {
    updateStudent,
};