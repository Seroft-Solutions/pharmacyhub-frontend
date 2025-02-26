'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import RBACGuard from '@/components/guards/RBACGuard';
import RequireAuth from '@/components/guards/RequireAuth';

/**
 * Dashboard page demonstrating RBAC usage
 */
export default function Dashboard() {
  const {
    user,
    hasRole,
    hasPermission,
    isAdmin,
    isPharmacist,
    isProprietor,
    isPharmacyManager,
    isSalesman
  } = useAuth();

  return (
    <RequireAuth>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.firstName || user?.name}</h2>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Your Role Information:</h3>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Roles:</strong> {user?.roles.join(', ') || 'No roles assigned'}</p>
            <p><strong>User Type:</strong> {user?.userType || 'Not specified'}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Admin Section */}
            <RBACGuard roles={['ADMIN', 'SUPER_ADMIN']} fallback={null}>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Admin Panel</h3>
                <p className="text-blue-700 text-sm">
                  You have administrator privileges. You can manage users, view reports, and configure system settings.
                </p>
                <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm">
                  Manage Users
                </button>
              </div>
            </RBACGuard>
            
            {/* Pharmacist Section */}
            <RBACGuard roles={['PHARMACIST']} fallback={null}>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">Pharmacist Dashboard</h3>
                <p className="text-green-700 text-sm">
                  You can view and manage prescriptions, check inventory, and contact physicians.
                </p>
                <button className="mt-2 bg-green-600 text-white px-3 py-1 rounded text-sm">
                  Manage Prescriptions
                </button>
              </div>
            </RBACGuard>
            
            {/* Proprietor Section */}
            <RBACGuard roles={['PROPRIETOR']} fallback={null}>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2">Proprietor Tools</h3>
                <p className="text-purple-700 text-sm">
                  You can oversee pharmacy operations, review financial reports, and manage staff.
                </p>
                <button className="mt-2 bg-purple-600 text-white px-3 py-1 rounded text-sm">
                  View Financial Reports
                </button>
              </div>
            </RBACGuard>
            
            {/* Pharmacy Manager Section */}
            <RBACGuard roles={['PHARMACY_MANAGER']} fallback={null}>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">Manager Dashboard</h3>
                <p className="text-yellow-700 text-sm">
                  You can manage inventory, schedule staff, and handle customer inquiries.
                </p>
                <button className="mt-2 bg-yellow-600 text-white px-3 py-1 rounded text-sm">
                  Manage Inventory
                </button>
              </div>
            </RBACGuard>
            
            {/* Salesman Section */}
            <RBACGuard roles={['SALESMAN']} fallback={null}>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-2">Sales Dashboard</h3>
                <p className="text-orange-700 text-sm">
                  You can process sales, manage customer accounts, and check product availability.
                </p>
                <button className="mt-2 bg-orange-600 text-white px-3 py-1 rounded text-sm">
                  New Sale
                </button>
              </div>
            </RBACGuard>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Access Control Demo</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Role-based sections to demonstrate conditional rendering */}
            <div className={`p-4 rounded-lg ${isAdmin() ? 'bg-green-100 border border-green-300' : 'bg-gray-100 border border-gray-300'}`}>
              <h3 className="font-semibold mb-2">Admin Access</h3>
              <p className="text-sm">Status: {isAdmin() ? '✅ Granted' : '❌ Denied'}</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isPharmacist() ? 'bg-green-100 border border-green-300' : 'bg-gray-100 border border-gray-300'}`}>
              <h3 className="font-semibold mb-2">Pharmacist Access</h3>
              <p className="text-sm">Status: {isPharmacist() ? '✅ Granted' : '❌ Denied'}</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isProprietor() ? 'bg-green-100 border border-green-300' : 'bg-gray-100 border border-gray-300'}`}>
              <h3 className="font-semibold mb-2">Proprietor Access</h3>
              <p className="text-sm">Status: {isProprietor() ? '✅ Granted' : '❌ Denied'}</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isPharmacyManager() ? 'bg-green-100 border border-green-300' : 'bg-gray-100 border border-gray-300'}`}>
              <h3 className="font-semibold mb-2">Manager Access</h3>
              <p className="text-sm">Status: {isPharmacyManager() ? '✅ Granted' : '❌ Denied'}</p>
            </div>
            
            <div className={`p-4 rounded-lg ${isSalesman() ? 'bg-green-100 border border-green-300' : 'bg-gray-100 border border-gray-300'}`}>
              <h3 className="font-semibold mb-2">Salesman Access</h3>
              <p className="text-sm">Status: {isSalesman() ? '✅ Granted' : '❌ Denied'}</p>
            </div>
            
            <div className={`p-4 rounded-lg ${hasPermission('UPDATE_STATUS') ? 'bg-green-100 border border-green-300' : 'bg-gray-100 border border-gray-300'}`}>
              <h3 className="font-semibold mb-2">Update Status Permission</h3>
              <p className="text-sm">Status: {hasPermission('UPDATE_STATUS') ? '✅ Granted' : '❌ Denied'}</p>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}