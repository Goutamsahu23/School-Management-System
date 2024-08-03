import React, { useState, useEffect } from 'react';

const Table = ({ columns, data, onEdit, onDelete, onFilterChange, filterOptions }) => {
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    // Initialize filter options only when the columns or data change
    const initFilterOptions = () => {
      const options = {};
      columns.forEach(col => {
        if (col.filterType === 'dropdown' && col.key) {
          options[col.key] = [...new Set(data.map(item => item[col.key]))];
        }
      });
      onFilterChange('options', options);
    };

    initFilterOptions();
  }, [data, columns, onFilterChange]);

  const handleChange = (key, value) => {
    setEditData(prev => ({ ...prev, [key]: value }));
  };

  const handleEdit = (row, index) => {
    setEditingRowIndex(index);
    setEditData(row); // Initialize editData with the row's data
  };

  const handleSave = (event) => {
    event.preventDefault(); // Prevent default form submission if inside a form
    if (editingRowIndex !== null) {
      onEdit(editData);
      setEditingRowIndex(null);
    }
  };

  const handleDelete = (index) => {
    if (onDelete) {
      onDelete(data[index]);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} className="py-2 px-4 border-b border-gray-300">
                <div className="flex items-center">
                  <span className="font-medium">{col.label}</span>
                  {col.filterType === 'text' && (
                    <input
                      type="text"
                      placeholder={`Filter ${col.label}`}
                      onChange={(e) => onFilterChange(col.key, e.target.value)}
                      className="ml-2 border rounded p-1 text-sm"
                    />
                  )}
                  {col.filterType === 'date' && (
                    <input
                      type="date"
                      onChange={(e) => onFilterChange(col.key, e.target.value)}
                      className="ml-2 border rounded p-1 text-sm"
                    />
                  )}
                  {col.filterType === 'dropdown' && (
                    <select
                      onChange={(e) => onFilterChange(col.key, e.target.value)}
                      className="ml-2 border rounded p-1 text-sm"
                    >
                      <option value="">All</option>
                      {(filterOptions[col.key] || []).map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </div>
              </th>
            ))}
            <th className="py-2 px-4 border-b border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length ? data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map(col => (
                <td key={col.key} className="py-2 px-4 border-b border-gray-300">
                  {editingRowIndex === rowIndex ? (
                    <input
                      type="text"
                      value={editData[col.key] || ''}
                      onChange={(e) => handleChange(col.key, e.target.value)}
                      className="border rounded p-1 text-sm w-full"
                    />
                  ) : (
                    col.render ? col.render(row) : row[col.key]
                  )}
                </td>
              ))}
              <td className="py-2 px-4 border-b border-gray-300">
                {editingRowIndex === rowIndex ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingRowIndex(null)}
                      className="px-2 py-1 bg-red-500 text-white rounded ml-2 hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(row, rowIndex)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rowIndex)}
                      className="px-2 py-1 bg-red-500 text-white rounded ml-2 hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length + 1} className="py-2 px-4 text-center border-b border-gray-300">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
