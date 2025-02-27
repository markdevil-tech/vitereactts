import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { historyApi } from '../services/api';
import { History } from '../types/database';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await historyApi.getAll();
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
          <Link
            to="/products"
            className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <Package className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                <p className="text-gray-500">Manage your product inventory</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admins"
            className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">Admins</h2>
                <p className="text-gray-500">Manage administrator accounts</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Riwayat Barang Masuk & Keluar */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-6 w-6 text-indigo-600 mr-2" />
            Product History
          </h2>

          {loading ? (
            <div className="text-center text-gray-500">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center text-gray-500">No history found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {history.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{entry.product_name}</td>
                      <td className={`px-6 py-4 font-semibold ${entry.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                        {entry.type === 'in' ? 'Incoming' : 'Outgoing'}
                      </td>
                      <td className="px-6 py-4">{entry.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
