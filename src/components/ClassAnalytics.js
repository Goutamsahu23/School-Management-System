import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);


const ClassAnalytics = ({ classData, studentsGenderStats }) => {
  if (!classData) return <div>Loading...</div>;

  const { name, year, teacher, students } = classData;

  const genderChartData = {
    labels: ['Male', 'Female'],
    datasets: [{
      data: [studentsGenderStats.male, studentsGenderStats.female],
      backgroundColor: ['#36A2EB', '#FF6384'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">Class Name:- {name}</h1>
        <h1 className="text-3xl font-bold mb-2">Year :- {year}</h1>
        <p className="text-lg mb-2">
          <strong className="font-semibold">Teacher:</strong> {teacher ? teacher.name : 'No Teacher Assigned'}
        </p>
      </div>

      <div className='flex flex-row-reverse justify-between'>
        <div className="mt-6 ">
          {/* <h2 className="text-2xl font-bold mb-4">Student Gender Distribution</h2> */}
          <div className="flex justify-center">
            <div style={{ width: '400px', height: '400px' }}>
              <Pie data={genderChartData} />
            </div>
          </div>
        </div>

        <div className="mt-8 w-[70%]">
          <h2 className="text-2xl font-bold mb-4">Student List</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Gender</th>
                <th className="py-2 px-4 text-left">Date of Birth</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? students.map((student, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="py-2 px-4">{student.name}</td>
                  <td className="py-2 px-4">{student.gender}</td>
                  <td className="py-2 px-4">{student.dob}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="py-2 px-4 text-center">No students available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
};

export default ClassAnalytics;
