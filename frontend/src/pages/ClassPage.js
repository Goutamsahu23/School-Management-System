import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import Modal from 'react-modal';
import Form from '../components/Form';

Modal.setAppElement('#root'); // Set the app element for accessibility

const ClassPage = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [filters, setFilters] = useState({ year: '', className: '' });
  const [filterOptions, setFilterOptions] = useState({});

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [classes, filters]);

  useEffect(() => {
    const options = {};
    columns.forEach(col => {
      if (col.filterType === 'dropdown') {
        // Extract unique values for dropdown filters
        const uniqueValues = [...new Set(classes.map(row => row[col.key]))];
        options[col.key] = uniqueValues;
      }
    });
    setFilterOptions(options);
  }, [classes]);

  const fetchClasses = () => {
    axios.get('http://localhost:5000/api/classes')
      .then(response => setClasses(response.data))
      .catch(error => console.error('Error fetching classes:', error));
  };

  const applyFilters = () => {
    let filtered = [...classes];

    // Apply filters based on the filter values
    if (filters.year) {
      filtered = filtered.filter(classItem => classItem.year === filters.year);
    }

    if (filters.className) {
      filtered = filtered.filter(classItem => classItem.name === filters.className);
    }

    setFilteredClasses(filtered);
  };

  const handleSave = (data) => {
    if (currentClass) {
      axios.put(`http://localhost:5000/api/classes/${currentClass._id}`, data)
        .then(response => {
          setClasses(classes.map(classItem => classItem._id === response.data._id ? response.data : classItem));
          closeModal();
        })
        .catch(error => console.error('Error updating class:', error));
    } else {
      axios.post('http://localhost:5000/api/classes', data)
        .then(response => {
          setClasses([...classes, response.data]);
          closeModal();
        })
        .catch(error => console.error('Error creating class:', error));
    }
  };

  const handleEdit = (data, rowIndex) => {
    if (classes[rowIndex]) {
      const updatedClass = { ...data };
      axios.put(`http://localhost:5000/api/classes/${classes[rowIndex]._id}`, updatedClass)
        .then(response => {
          setClasses(classes.map(classItem => classItem._id === response.data._id ? response.data : classItem));
        })
        .catch(error => console.error('Error updating class:', error));
    }
  };

  const handleDelete = (data, index) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      axios.delete(`http://localhost:5000/api/classes/${data._id}`)
        .then(() => {
          setClasses(classes.filter(classItem => classItem._id !== data._id));
        })
        .catch(error => console.error('Error deleting class:', error));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const columns = [
    { key: 'name', label: 'Class Name', filterType: 'dropdown' },
    { key: 'year', label: 'Year', filterType: 'dropdown' },
    { key: 'teacher', label: 'Teacher', render: (row) => row.teacher ? row.teacher.name : 'No Teacher' },
    { key: 'studentFees', label: 'Student Fees', render: (row) => row.studentFees ? `$${row.studentFees}` : 'N/A' },
  ];

  const openModal = () => setIsAdding(true);
  const closeModal = () => {
    setIsAdding(false);
    setCurrentClass(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Classes</h1>

      <Table
        columns={columns}
        data={filteredClasses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFilterChange={handleFilterChange}
        filterOptions={filterOptions} // Pass filterOptions to Table
      />

      <Modal
        isOpen={isAdding}
        onRequestClose={closeModal}
        contentLabel="Class Form"
        className="modal bg-white rounded-lg shadow-lg p-6"
        overlayClassName="modal-overlay fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      >
        <div className="flex flex-col gap-4">
          <Form
            formType={currentClass ? 'editClass' : 'addClass'}
            onSave={handleSave}
            initialData={currentClass}
          />
        </div>
      </Modal>

      <button
        onClick={() => {
          setIsAdding(true);
          setCurrentClass(null); // Clear current class if adding new
        }}
        className="absolute bottom-6 right-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
      >
        Add New Class
      </button>
    </div>
  );
};

export default ClassPage;
