const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    name: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    contactDetails: { type: String, required: true },
    feesPaid: { type: Number, required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
