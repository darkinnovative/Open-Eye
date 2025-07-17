import React, { useState } from 'react';

const AccountSettings = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('security');
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    motion: true,
    system: true,
    offline: true
  });
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    theme: 'dark'
  });
  const [alertSettings, setAlertSettings] = useState({
    motionDetection: {
      enabled: true,
      sensitivity: 'medium',
      recordingEnabled: true,
      notificationSound: true,
      emailNotification: true,
      pushNotification: true
    },
    systemAlerts: {
      enabled: true,
      cpuThreshold: 80,
      memoryThreshold: 85,
      storageThreshold: 90,
      emailNotification: true,
      pushNotification: true
    },
    cameraAlerts: {
      enabled: true,
      offlineDetection: true,
      connectionTimeout: 30,
      emailNotification: true,
      pushNotification: true
    },
    recordingAlerts: {
      enabled: true,
      storageFullAlert: true,
      recordingFailure: true,
      emailNotification: true,
      pushNotification: false
    },
    alertSchedule: {
      enabled: false,
      startTime: '09:00',
      endTime: '17:00',
      weekendsEnabled: false
    }
  });

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAlertSettingChange = (category, field, value) => {
    setAlertSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handlePasswordSubmit = () => {
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match!');
      return;
    }
    if (passwords.new.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    console.log('Password change submitted');
    alert('Password changed successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const tabs = [
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'alerts', label: 'Alert Settings', icon: '🚨' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Account Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-700 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-600'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Current Password</label>
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => handlePasswordChange('current', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter current password"
                />
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">New Password</label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => handlePasswordChange('new', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter new password"
                />
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <button
              onClick={handlePasswordSubmit}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Update Password
            </button>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-medium text-white mb-4">Notification Types</h4>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => handleNotificationChange('email', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Email Notifications</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) => handleNotificationChange('push', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Push Notifications</span>
                  </label>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="text-lg font-medium text-white mb-4">Alert Categories</h4>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notifications.motion}
                      onChange={(e) => handleNotificationChange('motion', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Motion Detection</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notifications.system}
                      onChange={(e) => handleNotificationChange('system', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">System Alerts</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={notifications.offline}
                      onChange={(e) => handleNotificationChange('offline', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Camera Offline</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('Notification settings saved!')}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Save Notification Settings
            </button>
          </div>
        )}

        {/* Alert Settings Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-8">
            {/* Motion Detection Alerts */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-medium text-white mb-6 flex items-center">
                <span className="mr-3">🎯</span>
                Motion Detection Alerts
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.motionDetection.enabled}
                      onChange={(e) => handleAlertSettingChange('motionDetection', 'enabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Enable Motion Detection Alerts</span>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Sensitivity</label>
                    <select
                      value={alertSettings.motionDetection.sensitivity}
                      onChange={(e) => handleAlertSettingChange('motionDetection', 'sensitivity', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-blue-500"
                      disabled={!alertSettings.motionDetection.enabled}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.motionDetection.recordingEnabled}
                      onChange={(e) => handleAlertSettingChange('motionDetection', 'recordingEnabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      disabled={!alertSettings.motionDetection.enabled}
                    />
                    <span className="text-white">Auto-record on motion</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.motionDetection.notificationSound}
                      onChange={(e) => handleAlertSettingChange('motionDetection', 'notificationSound', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      disabled={!alertSettings.motionDetection.enabled}
                    />
                    <span className="text-white">Play notification sound</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.motionDetection.emailNotification}
                      onChange={(e) => handleAlertSettingChange('motionDetection', 'emailNotification', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      disabled={!alertSettings.motionDetection.enabled}
                    />
                    <span className="text-white">Email notifications</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.motionDetection.pushNotification}
                      onChange={(e) => handleAlertSettingChange('motionDetection', 'pushNotification', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      disabled={!alertSettings.motionDetection.enabled}
                    />
                    <span className="text-white">Push notifications</span>
                  </label>
                </div>
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-medium text-white mb-6 flex items-center">
                <span className="mr-3">⚙️</span>
                System Alerts
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.systemAlerts.enabled}
                      onChange={(e) => handleAlertSettingChange('systemAlerts', 'enabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Enable System Alerts</span>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">CPU Threshold (%)</label>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={alertSettings.systemAlerts.cpuThreshold}
                      onChange={(e) => handleAlertSettingChange('systemAlerts', 'cpuThreshold', parseInt(e.target.value))}
                      className="w-full"
                      disabled={!alertSettings.systemAlerts.enabled}
                    />
                    <div className="text-sm text-gray-400 text-center">{alertSettings.systemAlerts.cpuThreshold}%</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Memory Threshold (%)</label>
                    <input
                      type="range"
                      min="50"
                      max="95"
                      value={alertSettings.systemAlerts.memoryThreshold}
                      onChange={(e) => handleAlertSettingChange('systemAlerts', 'memoryThreshold', parseInt(e.target.value))}
                      className="w-full"
                      disabled={!alertSettings.systemAlerts.enabled}
                    />
                    <div className="text-sm text-gray-400 text-center">{alertSettings.systemAlerts.memoryThreshold}%</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Storage Threshold (%)</label>
                    <input
                      type="range"
                      min="70"
                      max="98"
                      value={alertSettings.systemAlerts.storageThreshold}
                      onChange={(e) => handleAlertSettingChange('systemAlerts', 'storageThreshold', parseInt(e.target.value))}
                      className="w-full"
                      disabled={!alertSettings.systemAlerts.enabled}
                    />
                    <div className="text-sm text-gray-400 text-center">{alertSettings.systemAlerts.storageThreshold}%</div>
                  </div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.systemAlerts.emailNotification}
                      onChange={(e) => handleAlertSettingChange('systemAlerts', 'emailNotification', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      disabled={!alertSettings.systemAlerts.enabled}
                    />
                    <span className="text-white">Email notifications</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.systemAlerts.pushNotification}
                      onChange={(e) => handleAlertSettingChange('systemAlerts', 'pushNotification', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      disabled={!alertSettings.systemAlerts.enabled}
                    />
                    <span className="text-white">Push notifications</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Camera Alerts */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-medium text-white mb-6 flex items-center">
                <span className="mr-3">📹</span>
                Camera Alerts
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.cameraAlerts.enabled}
                      onChange={(e) => handleAlertSettingChange('cameraAlerts', 'enabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Enable Camera Alerts</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.cameraAlerts.offlineDetection}
                      onChange={(e) => handleAlertSettingChange('cameraAlerts', 'offlineDetection', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      disabled={!alertSettings.cameraAlerts.enabled}
                    />
                    <span className="text-white">Offline detection</span>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Connection Timeout (seconds)</label>
                    <input
                      type="number"
                      min="10"
                      max="120"
                      value={alertSettings.cameraAlerts.connectionTimeout}
                      onChange={(e) => handleAlertSettingChange('cameraAlerts', 'connectionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-blue-500"
                      disabled={!alertSettings.cameraAlerts.enabled}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.cameraAlerts.emailNotification}
                      onChange={(e) => handleAlertSettingChange('cameraAlerts', 'emailNotification', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      disabled={!alertSettings.cameraAlerts.enabled}
                    />
                    <span className="text-white">Email notifications</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.cameraAlerts.pushNotification}
                      onChange={(e) => handleAlertSettingChange('cameraAlerts', 'pushNotification', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      disabled={!alertSettings.cameraAlerts.enabled}
                    />
                    <span className="text-white">Push notifications</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Recording Alerts */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-medium text-white mb-6 flex items-center">
                <span className="mr-3">🎬</span>
                Recording Alerts
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.recordingAlerts.enabled}
                      onChange={(e) => handleAlertSettingChange('recordingAlerts', 'enabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Enable Recording Alerts</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.recordingAlerts.storageFullAlert}
                      onChange={(e) => handleAlertSettingChange('recordingAlerts', 'storageFullAlert', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      disabled={!alertSettings.recordingAlerts.enabled}
                    />
                    <span className="text-white">Storage full alerts</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.recordingAlerts.recordingFailure}
                      onChange={(e) => handleAlertSettingChange('recordingAlerts', 'recordingFailure', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      disabled={!alertSettings.recordingAlerts.enabled}
                    />
                    <span className="text-white">Recording failure alerts</span>
                  </label>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.recordingAlerts.emailNotification}
                      onChange={(e) => handleAlertSettingChange('recordingAlerts', 'emailNotification', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      disabled={!alertSettings.recordingAlerts.enabled}
                    />
                    <span className="text-white">Email notifications</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.recordingAlerts.pushNotification}
                      onChange={(e) => handleAlertSettingChange('recordingAlerts', 'pushNotification', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      disabled={!alertSettings.recordingAlerts.enabled}
                    />
                    <span className="text-white">Push notifications</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Alert Schedule */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h4 className="text-lg font-medium text-white mb-6 flex items-center">
                <span className="mr-3">⏰</span>
                Alert Schedule
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.alertSchedule.enabled}
                      onChange={(e) => handleAlertSettingChange('alertSchedule', 'enabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-white">Enable Alert Schedule</span>
                  </label>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={alertSettings.alertSchedule.startTime}
                      onChange={(e) => handleAlertSettingChange('alertSchedule', 'startTime', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-blue-500"
                      disabled={!alertSettings.alertSchedule.enabled}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                    <input
                      type="time"
                      value={alertSettings.alertSchedule.endTime}
                      onChange={(e) => handleAlertSettingChange('alertSchedule', 'endTime', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-blue-500"
                      disabled={!alertSettings.alertSchedule.enabled}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={alertSettings.alertSchedule.weekendsEnabled}
                      onChange={(e) => handleAlertSettingChange('alertSchedule', 'weekendsEnabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                      disabled={!alertSettings.alertSchedule.enabled}
                    />
                    <span className="text-white">Enable on weekends</span>
                  </label>
                  <div className="text-sm text-gray-400 bg-gray-800 p-3 rounded">
                    <p><strong>Note:</strong> When alert schedule is enabled, alerts will only be sent during the specified time range.</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert('Alert settings saved!')}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Save Alert Settings
            </button>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-700 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Language</label>
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Timezone</label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Date Format</label>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">Theme</label>
                <select
                  value={preferences.theme}
                  onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="dark">Dark Theme</option>
                  <option value="light">Light Theme</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => alert('Preferences saved!')}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Preferences
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
