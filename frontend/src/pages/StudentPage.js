import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Modal from 'react-modal';
import Form from '../components/Form';

Modal.setAppElement('#root');

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({});

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [students, filters]);

  useEffect(() => {
    // Extract unique gender options for the dropdown filter
    const uniqueGenders = [...new Set(students.map(student => student.gender))];
    setFilterOptions(prev => ({ ...prev, gender: uniqueGenders }));
  }, [students]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('https://school-management-system-b-api.onrender.com/api/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const applyFilters = () => {
    let filtered = students;
    if (filters.gender) {
      filtered = filtered.filter(student => student.gender === filters.gender);
    }
    if (filters.dob) {
      filtered = filtered.filter(student => new Date(student.dob).toDateString() === new Date(filters.dob).toDateString());
    }
    setFilteredStudents(filtered);
  };

  const handleSave = async (data) => {
    try {
      if (currentStudent) {
        const response = await axios.put(`https://school-management-system-b-api.onrender.com/api/students/${currentStudent._id}`, data);
        setStudents(students.map(student => student._id === response.data._id ? response.data : student));
      } else {
        const response = await axios.post('https://school-management-system-b-api.onrender.com/api/students', data);
        setStudents([...students, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const handleEdit = async (data, rowIndex) => {
    try {
      const updatedStudent = { ...data };
      const response = await axios.put(`https://school-management-system-b-api.onrender.com/api/students/${students[rowIndex]._id}`, updatedStudent);
      setStudents(students.map(student => student._id === response.data._id ? response.data : student));
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleDelete = async (data) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`https://school-management-system-b-api.onrender.com/api/students/${data._id}`);
        setStudents(students.filter(student => student._id !== data._id));
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'gender', label: 'Gender', filterType: 'dropdown' },
    { key: 'dob', label: 'Date of Birth', filterType: 'date' },
    { key: 'contactDetails', label: 'Contact Details' },
    { key: 'feesPaid', label: 'Fees Paid' },
  ];

  const openModal = () => setIsAdding(true);
  const closeModal = () => {
    setIsAdding(false);
    setCurrentStudent(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Students</h1>
      <button
        onClick={() => {
          setIsAdding(true);
          setCurrentStudent(null);
        }}
        className="absolute bottom-6 right-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
      >
        Add New Student
      </button>

      <Table
        columns={columns}
        data={filteredStudents}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFilterChange={handleFilterChange}
        filterOptions={filterOptions}
      />

      <Modal
        isOpen={isAdding}
        onRequestClose={closeModal}
        contentLabel="Student Form"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <Form
          formType={currentStudent ? 'editStudent' : 'addStudent'}
          onSave={handleSave}
          initialData={currentStudent}
        />
      </Modal>
    </div>
  );
};

export default StudentPage;
