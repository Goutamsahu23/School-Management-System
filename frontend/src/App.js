import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClassPage from './pages/ClassPage';
import TeacherPage from './pages/TeacherPage';
import StudentPage from './pages/StudentPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NavBar from './components/NavBar';

const App = () => {
  return (
    <Router>
      <NavBar />
      <main className="p-4">
        <Routes>
          <Route path="/classes" element={<ClassPage />} />
          <Route path="/teachers" element={<TeacherPage />} />
          <Route path="/students" element={<StudentPage />} />
          <Route path="/" element={<AnalyticsPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
