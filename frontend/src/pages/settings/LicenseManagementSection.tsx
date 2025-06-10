import React, { useEffect, useState } from 'react';
import { Users, Shield, Clock, Monitor, LogOut, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '../../stores/authStore';

const LicenseManagementSection = () => {
  const { licenseInfo, fetchLicenseInfo, forceLogoutUser, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLicenseInfo();
  }, [fetchLicenseInfo]);

  const handleForceLogout = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to force logout ${userName}? This will immediately end their session.`)) {
      setIsLoading(true);
      try {
        await forceLogoutUser(userId);
      } catch (error: any) {
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!licenseInfo) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const usagePercentage = (licenseInfo.licenseUsed / licenseInfo.licenseLimit) * 100;
  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = licenseInfo.licenseUsed >= licenseInfo.licenseLimit;

  return (
    <div className="space-y-6">
      {/* License Overview */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-slate-900 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-500" />
            License Overview
          </h3>
          {isAtLimit && (
            <div className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
              <AlertTriangle className="h-4 w-4 mr-1" />
              License Limit Reached
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Licenses</p>
                <p className="text-2xl font-bold text-slate-900">{licenseInfo.licenseLimit}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Used Licenses</p>
                <p className="text-2xl font-bold text-slate-900">{licenseInfo.licenseUsed}</p>
              </div>
              <Monitor className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Available</p>
                <p className="text-2xl font-bold text-slate-900">
                  {licenseInfo.licenseLimit - licenseInfo.licenseUsed}
                </p>
              </div>
              <Users className="h-8 w-8 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Usage Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>License Usage</span>
            <span>{usagePercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isAtLimit
                  ? 'bg-red-500'
                  : isNearLimit
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            ></div>
          </div>
          {isNearLimit && (
            <p className="text-sm text-amber-600 mt-2 flex items-center">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {isAtLimit 
                ? 'License limit reached. No new users can log in.'
                : 'Approaching license limit. Consider upgrading your plan.'
              }
            </p>
          )}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-slate-900 flex items-center">
            <Monitor className="h-5 w-5 mr-2 text-green-500" />
            Active Sessions ({licenseInfo.activeSessions.length})
          </h3>
          <button
            onClick={fetchLicenseInfo}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-1.5 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Clock className="h-4 w-4 mr-1.5" />
            Refresh
          </button>
        </div>

        {licenseInfo.activeSessions.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Monitor className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p>No active sessions</p>
          </div>
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900">
                    User
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                    Last Activity
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                    IP Address
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {licenseInfo.activeSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50">
                    <td className="py-4 pl-4 pr-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
                          {session.user.name.charAt(0)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-slate-900">
                            {session.user.name}
                          </div>
                          <div className="text-sm text-slate-500">
                            {session.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-500">
                      {format(new Date(session.lastActivity), 'MMM d, yyyy h:mm a')}
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-500 font-mono">
                      {session.ipAddress || 'Unknown'}
                    </td>
                    <td className="py-4 pl-3 pr-4 text-right text-sm">
                      {session.user.id !== user?.id && user?.role === 'admin' && (
                        <button
                          onClick={() => handleForceLogout(session.user.id, session.user.name)}
                          disabled={isLoading}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                          title="Force logout this user"
                        >
                          <LogOut className="h-3 w-3 mr-1" />
                          Force Logout
                        </button>
                      )}
                      {session.user.id === user?.id && (
                        <span className="inline-flex items-center px-2.5 py-1.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          Current Session
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* License Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              License Management Information
            </h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Only licensed users can log into the system simultaneously</p>
              <p>• Each active session consumes one license</p>
              <p>• Administrators can force logout users to free up licenses</p>
              <p>• Sessions automatically expire after 24 hours of inactivity</p>
              <p>• Contact your administrator to increase license limits</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LicenseManagementSection;