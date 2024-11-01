import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcryptjs';

const saltRounds = 10;

const CustomAlert = ({ message }) => (
  <div
    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mt-4"
    role="alert"
  >
    <p>{message}</p>
  </div>
);

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleLoginOrRegister = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if there are any existing users
      const { data: users, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      if (fetchError) throw fetchError;

      if (users.length === 0) {
        // No users exist; register the first user
        const hashedPassword = await bcrypt.hash(credentials.password, saltRounds);
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            { email: credentials.email, hashed_password: hashedPassword }
          ]);

        if (insertError) {
          throw insertError;
        }

        // Auto-login the user by storing their session data in localStorage
        const expirationDate = Date.now() + 15 * 24 * 60 * 60 * 1000; // 15 days from now
        localStorage.setItem('user', JSON.stringify({ email: credentials.email, expiry: expirationDate }));
        navigate('/'); // Redirect to homepage
      } else {
        // Users exist; attempt to log in
        const { data: user, error: fetchUserError } = await supabase
          .from('users')
          .select('id, hashed_password')
          .eq('email', credentials.email)
          .single();

        if (fetchUserError || !user) {
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.hashed_password);
        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        // Successful login, store user info and navigate to homepage
        const expirationDate = Date.now() + 15 * 24 * 60 * 60 * 1000; // 15 days from now
        localStorage.setItem('user', JSON.stringify({ email: credentials.email, expiry: expirationDate }));
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Something went wrong, please try again');
    } finally {
      setLoading(false);
    }
  }, [credentials, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Login / Register</h1>
        <form onSubmit={handleLoginOrRegister} className="space-y-4">
          <InputField
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            label="Email"
            className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          <InputField
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            label="Password"
            className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
        {error && <CustomAlert message={error} />}
      </div>
    </div>
  );
};

const InputField = ({ type, id, name, value, onChange, label, className }) => (
  <div className="space-y-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required
      className={className}
    />
  </div>
);

export default LoginPage;
