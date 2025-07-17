import React, { useState } from 'react';
import Swal from 'sweetalert2';

const CameraManagement = ({ cameras, setCameras }) => {
  const [isAddingCamera, setIsAddingCamera] = useState(false);
  const [editingCamera, setEditingCamera] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    stream: '',
    username: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCamera = () => {
    setIsAddingCamera(true);
    setFormData({
      name: '',
      ip: '',
      stream: '',
      username: '',
      password: ''
    });
  };

  const handleEditCamera = (camera) => {
    setEditingCamera(camera);
    setFormData({
      name: camera.name,
      ip: camera.ip,
      stream: camera.stream,
      username: camera.username || '',
      password: camera.password || ''
    });
  };

  const handleSaveCamera = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.ip || !formData.stream) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all required fields',
        background: '#2a2a2a',
        color: '#fff'
      });
      return;
    }

    try {
      if (editingCamera) {
        // Update existing camera
        const updatedCameras = cameras.map(camera => 
          camera.id === editingCamera.id 
            ? { ...camera, ...formData }
            : camera
        );
        setCameras(updatedCameras);
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Camera updated successfully',
          background: '#2a2a2a',
          color: '#fff'
        });
      } else {
        // Add new camera
        const newCamera = {
          id: Date.now(),
          ...formData,
          status: 'offline'
        };
        setCameras([...cameras, newCamera]);
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Camera added successfully',
          background: '#2a2a2a',
          color: '#fff'
        });
      }
      
      setIsAddingCamera(false);
      setEditingCamera(null);
      setFormData({
        name: '',
        ip: '',
        stream: '',
        username: '',
        password: ''
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save camera',
        background: '#2a2a2a',
        color: '#fff'
      });
    }
  };

  const handleDeleteCamera = async (cameraId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: '#2a2a2a',
      color: '#fff'
    });

    if (result.isConfirmed) {
      const updatedCameras = cameras.filter(camera => camera.id !== cameraId);
      setCameras(updatedCameras);
      
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Camera has been deleted.',
        background: '#2a2a2a',
        color: '#fff'
      });
    }
  };

  const handleTestConnection = async (camera) => {
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isOnline = Math.random() > 0.3; // 70% chance of success
      
      if (isOnline) {
        const updatedCameras = cameras.map(cam => 
          cam.id === camera.id 
            ? { ...cam, status: 'online' }
            : cam
        );
        setCameras(updatedCameras);
        
        Swal.fire({
          icon: 'success',
          title: 'Connection Test',
          text: 'Camera is online and responding',
          background: '#2a2a2a',
          color: '#fff'
        });
      } else {
        const updatedCameras = cameras.map(cam => 
          cam.id === camera.id 
            ? { ...cam, status: 'offline' }
            : cam
        );
        setCameras(updatedCameras);
        
        Swal.fire({
          icon: 'error',
          title: 'Connection Test',
          text: 'Camera is offline or not responding',
          background: '#2a2a2a',
          color: '#fff'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to test connection',
        background: '#2a2a2a',
        color: '#fff'
      });
    }
  };

  const handleCancel = () => {
    setIsAddingCamera(false);
    setEditingCamera(null);
    setFormData({
      name: '',
      ip: '',
      stream: '',
      username: '',
      password: ''
    });
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-nvr-text">Camera Management</h2>
        <button
          onClick={handleAddCamera}
          className="btn-primary"
          disabled={isAddingCamera || editingCamera}
        >
          Add Camera
        </button>
      </div>

      {(isAddingCamera || editingCamera) && (
        <div className="card mb-6">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-nvr-text">
              {editingCamera ? 'Edit Camera' : 'Add New Camera'}
            </h3>
          </div>
          
          <form onSubmit={handleSaveCamera} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-nvr-text mb-1">
                  Camera Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter camera name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-nvr-text mb-1">
                  IP Address *
                </label>
                <input
                  type="text"
                  name="ip"
                  value={formData.ip}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="192.168.1.100"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-nvr-text mb-1">
                  Stream URL *
                </label>
                <input
                  type="text"
                  name="stream"
                  value={formData.stream}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="rtsp://192.168.1.100:554/stream1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-nvr-text mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Optional"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-nvr-text mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Optional"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingCamera ? 'Update Camera' : 'Add Camera'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cameras.map((camera) => (
          <div key={camera.id} className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-nvr-text">{camera.name}</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                camera.status === 'online' 
                  ? 'bg-nvr-success bg-opacity-20 text-nvr-success' 
                  : 'bg-nvr-error bg-opacity-20 text-nvr-error'
              }`}>
                {camera.status}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-nvr-text-secondary">IP:</span>
                <span className="text-nvr-text">{camera.ip}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-nvr-text-secondary">Stream:</span>
                <span className="text-nvr-text text-xs truncate ml-2">{camera.stream}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleTestConnection(camera)}
                className="btn-secondary text-sm flex-1"
              >
                Test
              </button>
              <button
                onClick={() => handleEditCamera(camera)}
                className="btn-secondary text-sm flex-1"
                disabled={isAddingCamera || editingCamera}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteCamera(camera.id)}
                className="btn-error text-sm flex-1"
                disabled={isAddingCamera || editingCamera}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {cameras.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-nvr-text-secondary opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-nvr-text mb-2">No Cameras Found</h3>
          <p className="text-nvr-text-secondary mb-4">Add your first camera to start monitoring</p>
          <button onClick={handleAddCamera} className="btn-primary">
            Add Camera
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraManagement;
