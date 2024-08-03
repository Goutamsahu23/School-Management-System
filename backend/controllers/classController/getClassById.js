
const Class = require('../../models/classModel');
const getClassById = async (req, res) => {
    try {
        const classData = await Class.findById(req.params.id)
          .populate('teacher') // Populate teacher details
          .populate('students') // Populate students details if necessary
          .exec();
        res.json(classData);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching class data' });
      }
};

module.exports = {
    getClassById,
};