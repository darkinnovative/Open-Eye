import React, { useState, useEffect } from 'react';

const AlertsPanel = ({ isOpen, onClose }) => {
  const [alerts, setAlerts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock alerts data - in real implementation, this would come from FastAPI backend
  useEffect(() => {
    const mockAlerts = [
      {
        id: 1,
        type: 'motion',
        title: 'Motion Detected',
        message: 'Camera 2 detected motion in the parking area',
        camera: 'Camera 2',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        severity: 'high',
        read: false,
        thumbnail: 'https://via.placeholder.com/100x60/333/fff?text=Motion'
      },
      {
        id: 2,
        type: 'system',
        title: 'System Alert',
        message: 'High CPU usage detected (89%)',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        severity: 'medium',
        read: false
      },
      {
        id: 3,
        type: 'camera_offline',
        title: 'Camera Offline',
        message: 'Camera 4 has gone offline',
        camera: 'Camera 4',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        severity: 'high',
        read: false
      },
      {
        id: 4,
        type: 'recording_stopped',
        title: 'Recording Stopped',
        message: 'Recording stopped on Camera 1 due to storage full',
        camera: 'Camera 1',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        severity: 'critical',
        read: false
      },
      {
        id: 5,
        type: 'storage_full',
        title: 'Storage Almost Full',
        message: 'Storage is 95% full. Please free up space or add more storage.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        severity: 'critical',
        read: false
      },
      {
        id: 6,
        type: 'motion',
        title: 'Motion Detected',
        message: 'Camera 1 detected motion in the entrance',
        camera: 'Camera 1',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        severity: 'medium',
        read: true,
        thumbnail: 'https://via.placeholder.com/100x60/333/fff?text=Motion'
      }
    ];
    setAlerts(mockAlerts);
  }, []);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'motion':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        );
      case 'system':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'camera_offline':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 6.5l-4 4V9a1 1 0 00-1-1H8a1 1 0 00-1 1v6a1 1 0 001 1h8a1 1 0 001-1v-1.5l4 4V6.5zM16 14H8V9h8v5zm-8 4h8v2H8v-2z"/>
            <path d="M2 2l20 20-1.4 1.4L2 3.4 2 2z"/>
          </svg>
        );
      case 'recording_stopped':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h12v12H6z"/>
          </svg>
        );
      case 'storage_full':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        );
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getAlertBgColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10';
      case 'high':
        return 'bg-orange-500/10';
      case 'medium':
        return 'bg-yellow-500/10';
      case 'low':
        return 'bg-blue-500/10';
      default:
        return 'bg-gray-500/10';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !alert.read;
    return alert.type === activeFilter;
  });

  const unreadCount = alerts.filter(alert => !alert.read).length;

  const markAsRead = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };

  const clearAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const filterOptions = [
    { value: 'all', label: 'All Alerts', count: alerts.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'motion', label: 'Motion', count: alerts.filter(a => a.type === 'motion').length },
    { value: 'system', label: 'System', count: alerts.filter(a => a.type === 'system').length },
    { value: 'camera_offline', label: 'Camera Offline', count: alerts.filter(a => a.type === 'camera_offline').length },
    { value: 'recording_stopped', label: 'Recording Stopped', count: alerts.filter(a => a.type === 'recording_stopped').length },
    { value: 'storage_full', label: 'Storage Full', count: alerts.filter(a => a.type === 'storage_full').length }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-start justify-center pt-20 z-50">
      <div className="bg-nvr-card border border-nvr-border rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-nvr-border">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-nvr-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
            </svg>
            <h2 className="text-xl font-bold text-nvr-text">System Alerts</h2>
            {unreadCount > 0 && (
              <span className="bg-nvr-error text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={markAllAsRead}
              className="px-3 py-1 text-sm bg-nvr-primary text-white rounded hover:bg-nvr-primary/80 transition-colors"
            >
              Mark All Read
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-nvr-card-hover rounded transition-colors"
            >
              <svg className="w-5 h-5 text-nvr-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-nvr-border">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  activeFilter === option.value
                    ? 'bg-nvr-primary text-white'
                    : 'bg-nvr-card-hover text-nvr-text-secondary hover:bg-nvr-primary/20'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="overflow-y-auto max-h-96">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-nvr-text-secondary">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p>No alerts found</p>
            </div>
          ) : (
            <div className="divide-y divide-nvr-border">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 hover:bg-nvr-card-hover transition-colors ${
                    !alert.read ? 'bg-nvr-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getAlertBgColor(alert.severity)}`}>
                      <div className={getAlertColor(alert.severity)}>
                        {getAlertIcon(alert.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${alert.read ? 'text-nvr-text-secondary' : 'text-nvr-text'}`}>
                          {alert.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-nvr-text-secondary">
                            {formatTime(alert.timestamp)}
                          </span>
                          {!alert.read && (
                            <div className="w-2 h-2 bg-nvr-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-nvr-text-secondary mt-1">
                        {alert.message}
                      </p>
                      
                      {alert.camera && (
                        <div className="flex items-center space-x-2 mt-2">
                          <svg className="w-4 h-4 text-nvr-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-nvr-text-secondary">{alert.camera}</span>
                        </div>
                      )}
                      
                      {alert.thumbnail && (
                        <div className="mt-2">
                          <img
                            src={alert.thumbnail}
                            alt="Alert thumbnail"
                            className="w-24 h-16 object-cover rounded"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 mt-3">
                        {!alert.read && (
                          <button
                            onClick={() => markAsRead(alert.id)}
                            className="px-3 py-1 text-xs bg-nvr-primary text-white rounded hover:bg-nvr-primary/80 transition-colors"
                          >
                            Mark as Read
                          </button>
                        )}
                        <button
                          onClick={() => clearAlert(alert.id)}
                          className="px-3 py-1 text-xs bg-nvr-error text-white rounded hover:bg-nvr-error/80 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;
