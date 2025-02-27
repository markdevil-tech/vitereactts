import React from 'react';
import Navbar from '../components/Navbar';

export default function Admins() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Admins</h1>
        {/* Admin management interface will be implemented next */}
      </div>
    </div>
  );
}