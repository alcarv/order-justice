import React from 'react';
import { Settings, User, Bell, Shield, Database } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-800">Profile Settings</h2>
          </div>
          <p className="text-gray-600 mb-4">Manage your account information and preferences</p>
          <button className="text-primary hover:text-primary/80">
            Edit Profile Settings →
          </button>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
          </div>
          <p className="text-gray-600 mb-4">Configure your notification preferences</p>
          <button className="text-primary hover:text-primary/80">
            Manage Notifications →
          </button>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-800">Security</h2>
          </div>
          <p className="text-gray-600 mb-4">Update your security settings and passwords</p>
          <button className="text-primary hover:text-primary/80">
            Security Settings →
          </button>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold text-gray-800">Data & Privacy</h2>
          </div>
          <p className="text-gray-600 mb-4">Manage your data and privacy preferences</p>
          <button className="text-primary hover:text-primary/80">
            Data Settings →
          </button>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;