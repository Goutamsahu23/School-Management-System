import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {

  const location = useLocation();
  return (
    <nav className="bg-blue-500 p-4 text-white">
      <ul className="flex space-x-4">
        
        <li>
          <Link 
            to="/teachers" 
            className={`hover:underline ${location.pathname === '/teachers' ? 'font-bold' : ''}`}
          >
            Teachers
          </Link>
        </li>
        <li>
          <Link 
            to="/students" 
            className={`hover:underline ${location.pathname === '/students' ? 'font-bold' : ''}`}
          >
            Students
          </Link>
        </li>
        <li>
          <Link 
            to="/classes" 
            className={`hover:underline ${location.pathname === '/classes' ? 'font-bold' : ''}`}
          >
            Classes
          </Link>
        </li>
        <li>
          <Link 
            to="/" 
            className={`hover:underline ${location.pathname === '/financials' ? 'font-bold' : ''}`}
          >
            financials
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
