const mongoose = require('mongoose');

const classSchema = mongoose.Schema({
    name: { type: String, required: true },
    year: { type: Number, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    studentFees: { type: Number, required: true },
    students: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
        validate: [arrayLimit, 'A class cannot have more than 30 students'],
    },
});

function arrayLimit(val) {
    return val.length <= 30;
}

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
