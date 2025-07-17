import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LiveView from './components/LiveView';
import PlaybackView from './components/PlaybackView';
import CameraManagement from './components/CameraManagement';
import NetworkSettings from './components/NetworkSettings';
import VideoSettings from './components/VideoSettings';
import AudioSettings from './components/AudioSettings';
import StorageSettings from './components/StorageSettings';
import SystemSettings from './components/SystemSettings';
import AlertToastContainer from './components/AlertToastContainer';
import './App.css';

function App() {
  const [currentSection, setCurrentSection] = useState('live');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    totalCameras: 0,
    activeCameras: 0,
    storageUsed: 0,
    networkStatus: 'Connected'
  });
  const [alerts, setAlerts] = useState([]);
  const [toastAlerts, setToastAlerts] = useState([]);

  // Initialize app
  useEffect(() => {
    const initApp = async () => {
      try {
        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load saved section
        const savedSection = localStorage.getItem('currentSection');
        if (savedSection) {
          setCurrentSection(savedSection);
        }
        
        // Load cameras and system status
        await loadCameras();
        await loadSystemStatus();
        await loadAlerts();
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsLoading(false);
      }
    };

    // Listen for sidebar toggle events from full view
    const handleToggleSidebar = () => {
      setSidebarOpen(prev => !prev);
    };

    window.addEventListener('toggleSidebar', handleToggleSidebar);
    
    initApp();

    return () => {
      window.removeEventListener('toggleSidebar', handleToggleSidebar);
    };
  }, []);

  const loadCameras = async () => {
    try {
      // This would typically fetch from FastAPI backend
      const mockCameras = [
        { 
          id: 1, 
          name: 'Front Door', 
          ip: '192.168.1.100', 
          port: 8080,
          status: 'online', 
          stream: 'rtsp://192.168.1.100:554/stream1',
          type: 'IP',
          resolution: '1920x1080',
          fps: 30,
          location: 'Entrance'
        },
        { 
          id: 2, 
          name: 'Back Yard', 
          ip: '192.168.1.101', 
          port: 8080,
          status: 'online', 
          stream: 'rtsp://192.168.1.101:554/stream1',
          type: 'IP',
          resolution: '1920x1080',
          fps: 25,
          location: 'Garden'
        },
        { 
          id: 3, 
          name: 'Living Room', 
          ip: '192.168.1.102', 
          port: 8080,
          status: 'online', 
          stream: 'rtsp://192.168.1.102:554/stream1',
          type: 'IP',
          resolution: '1920x1080',
          fps: 30,
          location: 'Indoor'
        },
        { 
          id: 4, 
          name: 'Garage', 
          ip: '192.168.1.103', 
          port: 8080,
          status: 'offline', 
          stream: 'rtsp://192.168.1.103:554/stream1',
          type: 'IP',
          resolution: '1920x1080',
          fps: 30,
          location: 'Garage'
        },
        { 
          id: 5, 
          name: 'Parking Lot', 
          ip: '192.168.1.104', 
          port: 8080,
          status: 'online', 
          stream: 'rtsp://192.168.1.104:554/stream1',
          type: 'IP',
          resolution: '1920x1080',
          fps: 25,
          location: 'Outdoor'
        }
      ];
      setCameras(mockCameras);
    } catch (error) {
      console.error('Failed to load cameras:', error);
    }
  };

  const loadSystemStatus = async () => {
    try {
      // This would typically fetch from FastAPI backend
      const status = {
        totalCameras: 5,
        activeCameras: 4,
        storageUsed: 65,
        networkStatus: 'Connected'
      };
      setSystemStatus(status);
    } catch (error) {
      console.error('Failed to load system status:', error);
    }
  };

  const loadAlerts = async () => {
    try {
      // This would typically fetch from FastAPI backend
      // For now, we'll simulate alerts being generated
      const mockAlerts = [
        { id: 1, type: 'motion', severity: 'high', read: false },
        { id: 2, type: 'system', severity: 'medium', read: false },
        { id: 3, type: 'camera_offline', severity: 'high', read: false },
        { id: 4, type: 'recording_stopped', severity: 'critical', read: false },
        { id: 5, type: 'storage_full', severity: 'critical', read: false }
      ];
      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    }
  };

  // Simulate real-time alerts
  useEffect(() => {
    const generateAlert = () => {
      const alertTypes = ['motion', 'system', 'camera_offline', 'recording_stopped', 'storage_full'];
      const severities = ['low', 'medium', 'high', 'critical'];
      
      const newAlert = {
        id: Date.now(),
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        read: false,
        timestamp: new Date()
      };
      
      setAlerts(prev => [newAlert, ...prev.slice(0, 49)]); // Keep last 50 alerts
      setToastAlerts(prev => [newAlert, ...prev.slice(0, 2)]); // Show max 3 toasts
    };

    // Generate a new alert every 30 seconds (in real app, this would come from WebSocket)
    const interval = setInterval(generateAlert, 30000);
    return () => clearInterval(interval);
  }, []);

  const removeToastAlert = (alertId) => {
    setToastAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    localStorage.setItem('currentSection', section);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'live':
        return <LiveView cameras={cameras} />;
      case 'playback':
        return <PlaybackView cameras={cameras} alerts={alerts} />;
      case 'cameras':
        return <CameraManagement cameras={cameras} setCameras={setCameras} />;
      case 'network':
        return <NetworkSettings />;
      case 'video':
        return <VideoSettings />;
      case 'audio':
        return <AudioSettings />;
      case 'storage':
        return <StorageSettings />;
      case 'system':
        return <SystemSettings systemStatus={systemStatus} />;
      default:
        return <LiveView cameras={cameras} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-nvr-bg">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-nvr-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-nvr-text">Loading NVR System...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="h-screen bg-nvr-bg text-nvr-text overflow-hidden">
        <Header 
          currentSection={currentSection}
          systemStatus={systemStatus}
          onMenuClick={toggleSidebar}
          alerts={alerts}
        />
        
        <div className="flex h-full pt-16">
          <Sidebar 
            currentSection={currentSection}
            onSectionChange={handleSectionChange}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {renderContent()}
            </div>
          </main>
        </div>

        {/* Toast Notifications */}
        <AlertToastContainer 
          alerts={toastAlerts} 
          onRemoveAlert={removeToastAlert}
        />
      </div>
    </Router>
  );
}

export default App;
