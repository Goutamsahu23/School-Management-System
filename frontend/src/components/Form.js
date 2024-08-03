import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Form = ({ formType, onSave, initialData }) => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [className, setClassName] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [studentData, setStudentData] = useState({});
  const [teacherData, setTeacherData] = useState({});
  const [year, setYear] = useState('');
  const [studentFees, setStudentFees] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsResponse, teachersResponse, classesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/students'),
          axios.get('http://localhost:5000/api/teachers'),
          axios.get('http://localhost:5000/api/classes'),
        ]);
        setStudents(studentsResponse.data);
        setTeachers(teachersResponse.data);
        setClasses(classesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (formType === 'editStudent' && initialData) {
      setStudentData(initialData);
      setSelectedClassId(initialData.class || '');
    }
    if (formType === 'editTeacher' && initialData) {
      setTeacherData(initialData);
      setSelectedClassId(initialData.assignedClass || '');
    }
    if (formType === 'editClass' && initialData) {
      setClassName(initialData.name);
      setYear(initialData.year || '');
      setStudentFees(initialData.studentFees || '');
      setSelectedTeacher(initialData.teacher || '');
      setSelectedStudents(initialData.students || []);
      setSelectedClassId(initialData._id);
    }
  }, [formType, initialData]);

  const validateClass = () => {
    const errors = {};
    if (!className) errors.className = 'Class Name is required';
    if (!year) errors.year = 'Year is required';
    if (!studentFees) errors.studentFees = 'Student Fees is required';
    if (!selectedTeacher) errors.selectedTeacher = 'Teacher is required';
    if (selectedStudents.length === 0) errors.selectedStudents = 'At least one student must be selected';
    return errors;
  };

  const validateStudent = () => {
    const errors = {};
    if (!studentData.name) errors.name = 'Name is required';
    if (!studentData.gender) errors.gender = 'Gender is required';
    if (!studentData.dob) errors.dob = 'Date of Birth is required';
    if (!studentData.contactDetails) errors.contactDetails = 'Contact Details are required';
    return errors;
  };

  const validateTeacher = () => {
    const errors = {};
    if (!teacherData.name) errors.name = 'Name is required';
    if (!teacherData.gender) errors.gender = 'Gender is required';
    if (!teacherData.dob) errors.dob = 'Date of Birth is required';
    if (!teacherData.contactDetails) errors.contactDetails = 'Contact Details are required';
    if (!teacherData.salary) errors.salary = 'Salary is required';
    return errors;
  };

  const handleSave = () => {
    let validationErrors = {};
    if (formType === 'addClass' || formType === 'editClass') {
      validationErrors = validateClass();
    } else if (formType === 'addStudent' || formType === 'editStudent') {
      validationErrors = validateStudent();
    } else if (formType === 'addTeacher' || formType === 'editTeacher') {
      validationErrors = validateTeacher();
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (formType === 'addClass' || formType === 'editClass') {
      const newClass = {
        name: className,
        year,
        studentFees,
        students: selectedStudents,
        teacher: selectedTeacher,
      };
      onSave(newClass);
    } else if (formType === 'addStudent' || formType === 'editStudent') {
      const updatedStudent = { ...studentData, class: selectedClassId };
      onSave(updatedStudent);
    } else if (formType === 'addTeacher' || formType === 'editTeacher') {
      const updatedTeacher = { ...teacherData, assignedClass: selectedClassId };
      onSave(updatedTeacher);
    }
  };

  const handleStudentCheckboxChange = (studentId) => {
    setSelectedStudents(prevSelectedStudents =>
      prevSelectedStudents.includes(studentId)
        ? prevSelectedStudents.filter(id => id !== studentId)
        : [...prevSelectedStudents, studentId]
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">
        {formType === 'addClass' ? 'Add New Class' : 
         formType === 'editClass' ? 'Edit Class' : 
         formType === 'addStudent' ? 'Add New Student' :
         formType === 'editStudent' ? 'Edit Student' :
         formType === 'addTeacher' ? 'Add New Teacher' : 
         formType === 'editTeacher' ? 'Edit Teacher' : 
         'Manage Students/Teachers'}
      </h2>

      {(formType === 'addClass' || formType === 'editClass') && (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Class Name:
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="border rounded p-2 mt-1 w-full"
              />
              {errors.className && <p className="text-red-500 text-sm">{errors.className}</p>}
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Year:
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border rounded p-2 mt-1 w-full"
              />
              {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Student Fees:
              <input
                type="number"
                value={studentFees}
                onChange={(e) => setStudentFees(e.target.value)}
                className="border rounded p-2 mt-1 w-full"
              />
              {errors.studentFees && <p className="text-red-500 text-sm">{errors.studentFees}</p>}
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Teacher:
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="border rounded p-2 mt-1 w-full"
              >
                <option value="">Select Teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              {errors.selectedTeacher && <p className="text-red-500 text-sm">{errors.selectedTeacher}</p>}
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Students:
              <div className="mt-2">
                {students.map(student => (
                  <div key={student._id} className="mb-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student._id)}
                        onChange={() => handleStudentCheckboxChange(student._id)}
                        className="form-checkbox"
                      />
                      <span className="ml-2">{student.name}</span>
                    </label>
                  </div>
                ))}
              </div>
              {errors.selectedStudents && <p className="text-red-500 text-sm">{errors.selectedStudents}</p>}
            </label>
          </div>
        </div>
      )}

      {(formType === 'addStudent' || formType === 'editStudent') && (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Name:
              <input
                type="text"
                value={studentData.name || ''}
                onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                className="border rounded p-2 mt-1 w-full"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Gender:
              <select
                value={studentData.gender || ''}
                onChange={(e) => setStudentData({ ...studentData, gender: e.target.value })}
                className="border rounded p-2 mt-1 w-full"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Date of Birth:
              <input
                type="date"
                value={studentData.dob || ''}
                onChange={(e) => setStudentData({ ...studentData, dob: e.target.value })}
                className="border rounded p-2 mt-1 w-full"
              />
              {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Contact Details:
              <input
                type="text"
                value={studentData.contactDetails || ''}
                onChange={(e) => setStudentData({ ...studentData, contactDetails: e.target.value })}
                className="border rounded p-2 mt-1 w-full"
              />
              {errors.contactDetails && <p className="text-red-500 text-sm">{errors.contactDetails}</p>}
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Fees Paid:
              <input
                type="number"
                value={studentData.feesPaid || ''}
                onChange={(e) => setStudentData({ ...studentData, feesPaid: e.target.value })}
                className="border rounded p-2 mt-1 w-full"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Class:
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="border rounded p-2 mt-1 w-full"
              >
                <option value="">Select Class</option>
                {classes.map(classItem => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}

      {(formType === 'addTeacher' || formType === 'editTeacher') && (
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Name:
              <input
                type="text"
                value={teacherData.name || ''}
                onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
                className="border rounded p-2 mt-1 w-full"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Gender:
              <select
                value={teacherData.gender || ''}
                onChange={(e) => setTeacherData({ ...teacherData, gender: e.target.value })}
                className="border rounded p-2 mt-1 w-full"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Date of Birth:
              <input
                type="date"
                value={teacherData.dob || ''}
                onChange={(e) => setTeacherData({ ...teacherData, dob: e.target.value })}
                className="border rounded p-2 mt-1 w-full"
              />
              {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Contact Details:
              <input
                type="text"
                value={teacherData.contactDetails || ''}
                onChange={(e) => setTeacherData({ ...teacherData, contactDetails: e.target.value })}
                className="border rounded p-2 mt-1 w-full"
              />
              {errors.contactDetails && <p className="text-red-500 text-sm">{errors.contactDetails}</p>}
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Salary:
              <input
                type="number"
                value={teacherData.salary || ''}
                onChange={(e) => setTeacherData({ ...teacherData, salary: e.target.value })}
                className="border rounded p-2 mt-1 w-full"
              />
              {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Assigned Class:
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="border rounded p-2 mt-1 w-full"
              >
                <option value="">Select Class</option>
                {classes.map(classItem => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}

      <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded mt-4 hover:bg-blue-600">
        Save
      </button>
    </div>
  );
};

export default Form;
