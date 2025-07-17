import React, { useState, useEffect } from 'react';

const AlertToast = ({ alert, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, 5000); // Show for 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'motion':
        return '🔴';
      case 'system':
        return '⚠️';
      case 'camera_offline':
        return '📹';
      case 'recording_stopped':
        return '⏹️';
      case 'storage_full':
        return '💾';
      default:
        return '🔔';
    }
  };

  const getAlertTitle = (type) => {
    switch (type) {
      case 'motion':
        return 'Motion Detected';
      case 'system':
        return 'System Alert';
      case 'camera_offline':
        return 'Camera Offline';
      case 'recording_stopped':
        return 'Recording Stopped';
      case 'storage_full':
        return 'Storage Full';
      default:
        return 'Alert';
    }
  };

  const getAlertMessage = (type) => {
    switch (type) {
      case 'motion':
        return `Motion detected on Camera ${Math.floor(Math.random() * 4) + 1}`;
      case 'system':
        return 'System performance warning detected';
      case 'camera_offline':
        return `Camera ${Math.floor(Math.random() * 4) + 1} has gone offline`;
      case 'recording_stopped':
        return 'Recording stopped due to storage full';
      case 'storage_full':
        return 'Storage is 95% full - action required';
      default:
        return 'New alert received';
    }
  };

  const getBorderColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className={`transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`bg-nvr-card border ${getBorderColor(alert.severity)} border-l-4 rounded-lg shadow-lg p-4 min-w-80 max-w-sm`}>
        <div className="flex items-start space-x-3">
          <div className="text-2xl flex-shrink-0">
            {getAlertIcon(alert.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-nvr-text text-sm">
                {getAlertTitle(alert.type)}
              </h4>
              <button
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(onClose, 300);
                }}
                className="text-nvr-text-secondary hover:text-nvr-text transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-nvr-text-secondary text-sm mt-1">
              {getAlertMessage(alert.type)}
            </p>
            <div className="text-xs text-nvr-text-secondary mt-2">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertToastContainer = ({ alerts, onRemoveAlert }) => {
  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {alerts.map((alert) => (
        <AlertToast
          key={alert.id}
          alert={alert}
          onClose={() => onRemoveAlert(alert.id)}
        />
      ))}
    </div>
  );
};

export default AlertToastContainer;
