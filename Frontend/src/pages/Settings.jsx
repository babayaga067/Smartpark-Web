import React, { useState } from 'react';
import { Bell, Shield, Globe, Moon, Sun, Smartphone, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      bookingReminders: true,
      promotions: false,
      systemUpdates: true
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      analytics: true
    },
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'America/New_York',
      currency: 'USD'
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: '30'
    }
  });

  const [activeTab, setActiveTab] = useState('notifications');

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'security', label: 'Security', icon: Lock }
  ];

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="font-medium text-gray-900">{label}</div>
        {description && <div className="text-sm text-gray-500">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and privacy settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Preferences</h3>
                      <div className="space-y-1">
                        <ToggleSwitch
                          enabled={settings.notifications.email}
                          onChange={(value) => handleSettingChange('notifications', 'email', value)}
                          label="Email Notifications"
                          description="Receive notifications via email"
                        />
                        <ToggleSwitch
                          enabled={settings.notifications.push}
                          onChange={(value) => handleSettingChange('notifications', 'push', value)}
                          label="Push Notifications"
                          description="Receive push notifications on your device"
                        />
                        <ToggleSwitch
                          enabled={settings.notifications.sms}
                          onChange={(value) => handleSettingChange('notifications', 'sms', value)}
                          label="SMS Notifications"
                          description="Receive notifications via text message"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Preferences</h3>
                      <div className="space-y-1">
                        <ToggleSwitch
                          enabled={settings.notifications.bookingReminders}
                          onChange={(value) => handleSettingChange('notifications', 'bookingReminders', value)}
                          label="Booking Reminders"
                          description="Get reminded about upcoming parking reservations"
                        />
                        <ToggleSwitch
                          enabled={settings.notifications.promotions}
                          onChange={(value) => handleSettingChange('notifications', 'promotions', value)}
                          label="Promotions & Offers"
                          description="Receive special offers and promotional content"
                        />
                        <ToggleSwitch
                          enabled={settings.notifications.systemUpdates}
                          onChange={(value) => handleSettingChange('notifications', 'systemUpdates', value)}
                          label="System Updates"
                          description="Get notified about app updates and new features"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Privacy</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Visibility
                          </label>
                          <select
                            value={settings.privacy.profileVisibility}
                            onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="friends">Friends Only</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Data & Analytics</h3>
                      <div className="space-y-1">
                        <ToggleSwitch
                          enabled={settings.privacy.dataSharing}
                          onChange={(value) => handleSettingChange('privacy', 'dataSharing', value)}
                          label="Data Sharing"
                          description="Allow sharing anonymized data with partners"
                        />
                        <ToggleSwitch
                          enabled={settings.privacy.analytics}
                          onChange={(value) => handleSettingChange('privacy', 'analytics', value)}
                          label="Usage Analytics"
                          description="Help improve the app by sharing usage data"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">App Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Theme
                        </label>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleSettingChange('preferences', 'theme', 'light')}
                            className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all ${
                              settings.preferences.theme === 'light'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Sun className="h-4 w-4 mr-2" />
                            Light
                          </button>
                          <button
                            onClick={() => handleSettingChange('preferences', 'theme', 'dark')}
                            className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all ${
                              settings.preferences.theme === 'dark'
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Moon className="h-4 w-4 mr-2" />
                            Dark
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <select
                          value={settings.preferences.language}
                          onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={settings.preferences.timezone}
                          onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="America/New_York">Eastern Time</option>
                          <option value="America/Chicago">Central Time</option>
                          <option value="America/Denver">Mountain Time</option>
                          <option value="America/Los_Angeles">Pacific Time</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency
                        </label>
                        <select
                          value={settings.preferences.currency}
                          onChange={(e) => handleSettingChange('preferences', 'currency', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="CAD">CAD (C$)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
                      <div className="space-y-1">
                        <ToggleSwitch
                          enabled={settings.security.twoFactor}
                          onChange={(value) => handleSettingChange('security', 'twoFactor', value)}
                          label="Two-Factor Authentication"
                          description="Add an extra layer of security to your account"
                        />
                        <ToggleSwitch
                          enabled={settings.security.loginAlerts}
                          onChange={(value) => handleSettingChange('security', 'loginAlerts', value)}
                          label="Login Alerts"
                          description="Get notified when someone logs into your account"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Management</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <select
                          value={settings.security.sessionTimeout}
                          onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        Sign Out All Devices
                      </button>
                      <p className="text-sm text-gray-500 mt-2">
                        This will sign you out of all devices except this one
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;