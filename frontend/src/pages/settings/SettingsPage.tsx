import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Database, Sliders } from 'lucide-react';
import ParametersSection from './ParameterSection';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('parameters');

  const tabs = [
    { id: 'parameters', name: 'Parameters', icon: Sliders },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'data', name: 'Data & Privacy', icon: Database },
  ];

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your account settings and system preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-4 px-1 border-b-2 text-sm font-medium
                  ${activeTab === tab.id
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                `}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'parameters' && <ParametersSection />}
        {activeTab === 'profile' && (
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Profile Settings</h2>
            <p className="text-slate-600">Profile settings content will be added here.</p>
          </div>
        )}
        {activeTab === 'notifications' && (
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Notification Preferences</h2>
            <p className="text-slate-600">Notification settings content will be added here.</p>
          </div>
        )}
        {activeTab === 'security' && (
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Security Settings</h2>
            <p className="text-slate-600">Security settings content will be added here.</p>
          </div>
        )}
        {activeTab === 'data' && (
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Data & Privacy Settings</h2>
            <p className="text-slate-600">Data and privacy settings content will be added here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;