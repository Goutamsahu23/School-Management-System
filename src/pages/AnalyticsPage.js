import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ClassAnalytics from '../components/ClassAnalytics';
import FinancialAnalytics from '../components/FinancialAnalytics';

const AnalyticsPage = () => {
  const [view, setView] = useState('class'); // 'class' or 'financial'
  const [classData, setClassData] = useState(null);
  const [studentsGenderStats, setStudentsGenderStats] = useState({ male: 0, female: 0 });
  const [financialData, setFinancialData] = useState({ income: [], expenses: [] });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [classes, setClasses] = useState([]);
  const [currentClassId, setCurrentClassId] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('https://school-management-system-b-api.onrender.com/api/classes');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    if (view === 'class' && currentClassId) {
      const fetchClassData = async () => {
        try {
          const response = await axios.get(`https://school-management-system-b-api.onrender.com/api/classes/${currentClassId}`);
          setClassData(response.data);
          calculateGenderStats(response.data.students);
        } catch (error) {
          console.error('Error fetching class data:', error);
        }
      };

      const calculateGenderStats = (students) => {
        const stats = students.reduce((acc, student) => {
          acc[student.gender] = (acc[student.gender] || 0) + 1;
          return acc;
        }, {});
        setStudentsGenderStats({
          male: stats.Male || 0,
          female: stats.Female || 0
        });
      };

      fetchClassData();
    }
  }, [view, currentClassId]);

  useEffect(() => {
    if (view === 'financial') {
      const fetchFinancialData = async () => {
        try {
          const response = await axios.get('https://school-management-system-b-api.onrender.com/api/financials', {
            params: { month: selectedMonth, year: selectedYear }
          });
          setFinancialData(response.data);
        } catch (error) {
          console.error('Error fetching financial data:', error);
        }
      };

      fetchFinancialData();
    }
  }, [view, selectedMonth, selectedYear]);

  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === 'class') {
      setCurrentClassId(''); // Clear class ID when switching views
    }
  };

  const handleMonthChange = (e) => setSelectedMonth(e.target.value);
  const handleYearChange = (e) => setSelectedYear(e.target.value);

  return (
    <div className="p-6">
      <div className="mb-6 flex gap-4">
        <button
          className={`px-6 py-3 ${view === 'class' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'} rounded-lg shadow-md transition-colors duration-300`}
          onClick={() => handleViewChange('class')}
        >
          Class Analytics
        </button>
        <button
          className={`px-6 py-3 ${view === 'financial' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'} rounded-lg shadow-md transition-colors duration-300`}
          onClick={() => handleViewChange('financial')}
        >
          Financial Analytics
        </button>
      </div>

      {view === 'class' && (
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-lg font-semibold mb-2">
              Class:
              <select
                value={currentClassId}
                onChange={(e) => setCurrentClassId(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 mt-1 w-full"
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
          {currentClassId && classData && (
            <ClassAnalytics classData={classData} studentsGenderStats={studentsGenderStats} />
          )}
        </div>
      )}

      {view === 'financial' && (
        <FinancialAnalytics
          data={financialData}
          view={view}
          handleToggleView={() => setView(view === 'monthly' ? 'yearly' : 'monthly')}
          handleMonthChange={handleMonthChange}
          handleYearChange={handleYearChange}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      )}
    </div>
  );
};

export default AnalyticsPage;
