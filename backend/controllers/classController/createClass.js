const mongoose = require('mongoose');
const Class = require('../../models/classModel');

const createClass = async (req, res) => {
    const { name, year, teacher, studentFees, students } = req.body;

    // Ensure teacher is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(teacher)) {
        return res.status(400).json({ message: 'Invalid teacher ID' });
    }

    // Ensure students is an array of valid ObjectIds
    if (students && !students.every(id => mongoose.Types.ObjectId.isValid(id))) {
        return res.status(400).json({ message: 'One or more student IDs are invalid' });
    }

    // Check if the number of students exceeds the limit
    if (students && students.length > 30) {
        return res.status(400).json({ message: 'A class cannot have more than 30 students' });
    }

    try {
        const newClass = new Class({
            name,
            year,
            teacher,
            studentFees,
            students: students || [], // Default to empty array if not provided
        });

        await newClass.save();

        // Populate the teacher and students fields after saving
        const populatedClass = await Class.findById(newClass._id)
            .populate('teacher')
            .populate('students');

        res.status(201).json(populatedClass);
    } catch (error) {
        res.status(500).json({ message: 'Error creating class', error });
    }
};

module.exports = { createClass };
