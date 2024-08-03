
const Class = require('../../models/classModel');
const deleteClass = async (req, res) => {
    const classData = await Class.findByIdAndDelete(req.params.id);

    if (classData) {
        res.json({ message: 'Class removed' });
    } else {
        res.status(404).json({ message: 'Class not found' });
    }
};

module.exports = {
    deleteClass,
};