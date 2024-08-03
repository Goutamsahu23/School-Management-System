const Class = require('../../models/classModel');

const getClasses = async (req, res) => {
    try {
        const classes = await Class.find().populate('teacher');
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching classes', error });
    }
};

module.exports = {
    getClasses,
    // other methods...
};
