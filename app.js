// App.js
import React, { useState, useEffect } from 'react';
import { Home, Users, PlusCircle } from 'lucide-react';

// ... (HomePage, AddHostPage, and AdminPage components remain the same)

// Main App Component
export default function App() {
  const [hosts, setHosts] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Fetch hosts from the server when the component mounts
    fetch('/api/hosts')
      .then(response => response.json())
      .then(data => setHosts(data))
      .catch(error => console.error('Error fetching hosts:', error));
  }, []);

  const addHost = (newHost) => {
    fetch('/api/hosts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newHost),
    })
      .then(response => response.json())
      .then(data => {
        setHosts([...hosts, data]);
        setCurrentPage('home');
      })
      .catch(error => console.error('Error adding host:', error));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage hosts={hosts} />;
      case 'addHost':
        return <AddHostPage addHost={addHost} />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage hosts={hosts} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex flex-col w-64 bg-gray-800">
        <div className="flex items-center justify-center h-20 shadow-md">
          <h1 className="text-2xl font-bold text-white">Centralis Cloud</h1>
        </div>
        <ul className="flex flex-col py-4">
          <li>
            <button onClick={() => setCurrentPage('home')} className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-200">
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><Home /></span>
              <span className="text-sm font-medium">Home</span>
            </button>
          </li>
          <li>
            <button onClick={() => setCurrentPage('addHost')} className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-200">
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><PlusCircle /></span>
              <span className="text-sm font-medium">Add Host</span>
            </button>
          </li>
          <li>
            <button onClick={() => setCurrentPage('admin')} className="flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-200">
              <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400"><Users /></span>
              <span className="text-sm font-medium">Admin</span>
            </button>
          </li>
        </ul>
      </div>
      
      <div className="flex-1 p-10 overflow-y-auto">
        {renderPage()}
      </div>
    </div>
  );
}
