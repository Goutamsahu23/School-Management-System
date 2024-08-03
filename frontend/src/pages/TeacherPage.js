import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Form from '../components/Form'; // Ensure the import path is correct
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the app element for accessibility

const TeacherPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({});

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [teachers, filters]);

  useEffect(() => {
    // Extract filter options when teachers data changes
    const uniqueGenders = [...new Set(teachers.map(teacher => teacher.gender))];
    setFilterOptions(prev => ({ ...prev, gender: uniqueGenders }));
  }, [teachers]);

  const fetchTeachers = () => {
    axios.get('https://school-management-system-b-api.onrender.com/api/teachers')
      .then(response => setTeachers(response.data))
      .catch(error => console.error('Error fetching teachers:', error));
  };

  const applyFilters = () => {
    let filtered = teachers;
    if (filters.dob) {
      filtered = filtered.filter(teacher => new Date(teacher.dob).toDateString() === new Date(filters.dob).toDateString());
    }
    if (filters.gender) {
      filtered = filtered.filter(teacher => teacher.gender === filters.gender);
    }
    setFilteredTeachers(filtered);
  };

  const handleSave = (data) => {
    if (isEditing && currentTeacher) {
      axios.put(`https://school-management-system-b-api.onrender.com/api/teachers/${currentTeacher._id}`, data)
        .then(response => {
          setTeachers(teachers.map(teacher => teacher._id === response.data._id ? response.data : teacher));
          closeModal();
        })
        .catch(error => console.error('Error updating teacher:', error));
    } else {
      axios.post('https://school-management-system-b-api.onrender.com/api/teachers', data)
        .then(response => {
          setTeachers([...teachers, response.data]);
          closeModal();
        })
        .catch(error => console.error('Error creating teacher:', error));
    }
  };

  const handleEdit = (data) => {
    setCurrentTeacher(data);
    setIsEditing(true);
    setIsAdding(true); // Open modal for editing
  };

  const handleDelete = (data) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      axios.delete(`https://school-management-system-b-api.onrender.com/api/teachers/${data._id}`)
        .then(() => {
          setTeachers(teachers.filter(teacher => teacher._id !== data._id));
        })
        .catch(error => console.error('Error deleting teacher:', error));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const closeModal = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentTeacher(null);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'gender', label: 'Gender', filterType: 'dropdown' },
    { key: 'dob', label: 'Date of Birth', filterType: 'date' },
    { key: 'contactDetails', label: 'Contact Details' },
    { key: 'salary', label: 'Salary' },
  ];

  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Teachers</h1>

      <Table
        columns={columns}
        data={filteredTeachers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFilterChange={handleFilterChange}
        filterOptions={filterOptions}
      />

      <Modal
        isOpen={isAdding || isEditing}
        onRequestClose={closeModal}
        contentLabel="Teacher Form"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <Form
          formType={isAdding ? (isEditing ? 'editTeacher' : 'addTeacher') : ''}
          onSave={handleSave}
          initialData={currentTeacher}
        />
      </Modal>

      <button
        onClick={() => {
          setIsAdding(true);
          setIsEditing(false); // Close editing mode if adding new
          setCurrentTeacher(null); // Clear current teacher if adding new
        }}
        className="absolute bottom-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
      >
        Add New Teacher
      </button>
    </div>
  );
};

export default TeacherPage;
