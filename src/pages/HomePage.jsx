import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user data is in localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login'); // Redirect to login if not logged in
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user ? user.email : 'User'}!
        </h1>
        <p className="text-gray-500">No additional data available.</p>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
