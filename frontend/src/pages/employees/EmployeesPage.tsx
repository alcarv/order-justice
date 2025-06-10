import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, UserCheck, UserX, Edit2, Trash2, Shield, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '../../stores/authStore';
import { useEmployeesStore } from '../../stores/employeeStore';
import EmployeeFormModal from './components/EmployeeFormModal';

const EmployeesPage = () => {
  const { user } = useAuthStore();
  const { employees, fetchEmployees, deleteEmployee, toggleEmployeeStatus, isLoading, error } = useEmployeesStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = async (employeeId: string, employeeName: string) => {
    if (window.confirm(`Are you sure you want to delete ${employeeName}? This action cannot be undone.`)) {
      try {
        await deleteEmployee(employeeId);
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const handleToggleStatus = async (employeeId: string, employeeName: string, currentStatus: boolean) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} ${employeeName}?`)) {
      try {
        await toggleEmployeeStatus(employeeId);
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'lawyer': return 'bg-blue-100 text-blue-800';
      case 'assistant': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // Calculate stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.isActive).length;
  const loggedInEmployees = employees.filter(emp => emp.currentSession?.isActive).length;

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">Employees</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your company's employees and their access levels
          </p>
        </div>
        {user?.role === 'admin' && (
          <div className="mt-4 md:mt-0">
            <button
              onClick={openAddModal}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600">Total Employees</p>
              <p className="text-lg font-semibold text-slate-900">{totalEmployees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600">Active</p>
              <p className="text-lg font-semibold text-slate-900">{activeEmployees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600">Logged In</p>
              <p className="text-lg font-semibold text-slate-900">{loggedInEmployees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <UserX className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-slate-600">Inactive</p>
              <p className="text-lg font-semibold text-slate-900">{totalEmployees - activeEmployees}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-lg">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search employees by name, email, or role..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Employee List */}
      {isLoading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto"></div>
          <p className="mt-3 text-sm text-slate-600">Loading employees...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg px-8 py-12 text-center">
          <Users className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-lg font-medium text-slate-900">
            {searchTerm ? 'No employees found' : 'No employees yet'}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {searchTerm 
              ? 'No employees match your search criteria. Try a different search term.'
              : 'Get started by adding your first employee.'
            }
          </p>
          {user?.role === 'admin' && !searchTerm && (
            <div className="mt-6">
              <button
                onClick={openAddModal}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900">
                    Employee
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                    Role
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                    Status
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                    Last Login
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                    Session
                  </th>
                  {user?.role === 'admin' && (
                    <th className="relative py-3.5 pl-3 pr-4">
                      <span className="sr-only">Actions</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50">
                    <td className="py-4 pl-4 pr-3">
                      <div className="flex items-center">
                        {employee.avatar ? (
                          <img 
                            src={employee.avatar} 
                            alt={employee.name} 
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-medium">
                            {employee.name.charAt(0)}
                          </div>
                        )}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-slate-900">
                            {employee.name}
                            {employee.id === user?.id && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(employee.role)}`}>
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.isActive)}`}>
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-500">
                      {employee.lastLogin 
                        ? format(new Date(employee.lastLogin), 'MMM d, yyyy h:mm a')
                        : 'Never'
                      }
                    </td>
                    <td className="px-3 py-4">
                      {employee.currentSession?.isActive ? (
                        <div className="flex items-center text-green-600">
                          <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-xs">Online</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-slate-400">
                          <div className="h-2 w-2 bg-slate-300 rounded-full mr-2"></div>
                          <span className="text-xs">Offline</span>
                        </div>
                      )}
                    </td>
                    {user?.role === 'admin' && (
                      <td className="py-4 pl-3 pr-4 text-right text-sm space-x-2">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"
                          title="Edit employee"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {employee.id !== user?.id && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(employee.id, employee.name, employee.isActive)}
                              className={`p-1 rounded-full hover:bg-slate-100 ${
                                employee.isActive 
                                  ? 'text-slate-400 hover:text-red-600' 
                                  : 'text-slate-400 hover:text-green-600'
                              }`}
                              title={employee.isActive ? 'Deactivate employee' : 'Activate employee'}
                            >
                              {employee.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleDelete(employee.id, employee.name)}
                              className="text-slate-400 hover:text-red-600 p-1 rounded-full hover:bg-slate-100"
                              title="Delete employee"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <EmployeeFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={editingEmployee}
      />
    </div>
  );
};

export default EmployeesPage;