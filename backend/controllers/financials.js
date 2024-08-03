const express = require('express');
const router = express.Router();
const Class = require('../models/classModel');
const Teacher = require('../models/teacherModel');
const Student = require('../models/studentModel');

// Endpoint to get financial data
const financials= async (req, res) => {
    try {
        const { month, year } = req.query;

        // Calculate Income (sum of student fees for the selected month and year)
        const classes = await Class.find()
            .populate('students', 'feesPaid')
            .exec();

        const income = classes.reduce((acc, classItem) => acc + classItem.studentFees, 0);

        // Calculate Expenses (sum of teacher salaries for the selected month and year)
        const teachers = await Teacher.find().exec();
        const expenses = teachers.reduce((acc, teacher) => acc + teacher.salary, 0);

        console.log(income)
        console.log(expenses)

        res.json({ income, expenses });
    } catch (error) {
        console.error('Error fetching financial data:', error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    financials,
};
