import React, { useState, useEffect } from 'react';

const PlaybackView = ({ cameras, alerts }) => {
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeRange, setTimeRange] = useState({ start: '00:00', end: '23:59' });
  const [recordings, setRecordings] = useState([]);
  const [currentPlayback, setCurrentPlayback] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showTimeline, setShowTimeline] = useState(true);
  const [alertTriggered, setAlertTriggered] = useState(false);

  const playbackSpeeds = [0.25, 0.5, 1, 1.5, 2, 4, 8];

  useEffect(() => {
    if (selectedCamera && selectedDate) {
      loadRecordings();
    }
  }, [selectedCamera, selectedDate, timeRange]);

  const loadRecordings = async () => {
    try {
      // Mock recordings data - in real implementation, this would fetch from FastAPI backend
      const mockRecordings = [
        {
          id: 1,
          camera: selectedCamera,
          date: selectedDate,
          startTime: '08:00:00',
          endTime: '08:30:00',
          duration: 1800,
          type: 'motion',
          fileSize: '2.5GB',
          thumbnail: `https://via.placeholder.com/160x90/333/fff?text=08:00`,
          alertTriggered: true
        },
        {
          id: 2,
          camera: selectedCamera,
          date: selectedDate,
          startTime: '14:15:00',
          endTime: '14:45:00',
          duration: 1800,
          type: 'scheduled',
          fileSize: '2.8GB',
          thumbnail: `https://via.placeholder.com/160x90/333/fff?text=14:15`,
          alertTriggered: false
        },
        {
          id: 3,
          camera: selectedCamera,
          date: selectedDate,
          startTime: '20:30:00',
          endTime: '21:00:00',
          duration: 1800,
          type: 'motion',
          fileSize: '2.2GB',
          thumbnail: `https://via.placeholder.com/160x90/333/fff?text=20:30`,
          alertTriggered: true
        }
      ];
      setRecordings(mockRecordings);
    } catch (error) {
      console.error('Failed to load recordings:', error);
    }
  };

  const handlePlayRecording = (recording) => {
    setCurrentPlayback(recording);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(recording.duration);
  };

  const handlePauseResume = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentPlayback(null);
    setCurrentTime(0);
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRecordingTypeIcon = (type) => {
    switch (type) {
      case 'motion':
        return '🔴';
      case 'scheduled':
        return '📅';
      case 'manual':
        return '⚪';
      default:
        return '📹';
    }
  };

  const getRecordingTypeColor = (type) => {
    switch (type) {
      case 'motion':
        return 'text-red-500';
      case 'scheduled':
        return 'text-blue-500';
      case 'manual':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const onlineCameras = cameras ? cameras.filter(camera => camera.status === 'online') : [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Playback</h2>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            {showTimeline ? 'Hide Timeline' : 'Show Timeline'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Search Controls */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Search Recordings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Camera</label>
              <select
                value={selectedCamera?.id || ''}
                onChange={(e) => setSelectedCamera(onlineCameras.find(cam => cam.id === parseInt(e.target.value)))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Camera</option>
                {onlineCameras.map(camera => (
                  <option key={camera.id} value={camera.id}>{camera.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Time Range</label>
              <div className="flex space-x-2">
                <input
                  type="time"
                  value={timeRange.start}
                  onChange={(e) => setTimeRange({ ...timeRange, start: e.target.value })}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-blue-500"
                />
                <span className="text-gray-300 py-2">to</span>
                <input
                  type="time"
                  value={timeRange.end}
                  onChange={(e) => setTimeRange({ ...timeRange, end: e.target.value })}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={loadRecordings}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Search Recordings
            </button>

            {/* Alert-triggered recordings filter */}
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertTriggered}
                  onChange={(e) => setAlertTriggered(e.target.checked)}
                  className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-300">Only show alert-triggered recordings</span>
              </label>
            </div>
          </div>
        </div>

        {/* Recordings List */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">
            Recordings {selectedCamera && `(${selectedCamera.name})`}
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recordings.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p>No recordings found</p>
                <p className="text-sm mt-1">Select a camera and date to search</p>
              </div>
            ) : (
              recordings
                .filter(recording => !alertTriggered || recording.alertTriggered)
                .map((recording) => (
                <div
                  key={recording.id}
                  className={`bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors cursor-pointer ${
                    recording.alertTriggered ? 'border-l-4 border-red-500' : ''
                  }`}
                  onClick={() => handlePlayRecording(recording)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={recording.thumbnail}
                        alt={`Recording at ${recording.startTime}`}
                        className="w-20 h-12 object-cover rounded"
                      />
                      {recording.alertTriggered && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{getRecordingTypeIcon(recording.type)}</span>
                        <span className={`text-sm font-medium ${getRecordingTypeColor(recording.type)}`}>
                          {recording.type.charAt(0).toUpperCase() + recording.type.slice(1)}
                        </span>
                        {recording.alertTriggered && (
                          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                            Alert
                          </span>
                        )}
                      </div>
                      <div className="text-white font-medium">
                        {recording.startTime} - {recording.endTime}
                      </div>
                      <div className="text-sm text-gray-400">
                        Duration: {formatTime(recording.duration)} • Size: {recording.fileSize}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Video Player */}
        <div className="bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Video Player</h3>
          
          <div className="aspect-video bg-black rounded-lg mb-4 relative">
            {currentPlayback ? (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={currentPlayback.thumbnail}
                  alt="Playback"
                  className="max-w-full max-h-full object-contain"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-lg font-medium mb-2">{currentPlayback.camera.name}</div>
                    <div className="text-sm">{currentPlayback.date} {currentPlayback.startTime}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 00.707-.293l2.414-2.414a1 1 0 011.414 0l2.414 2.414a1 1 0 00.707.293H19" />
                  </svg>
                  <p>Select a recording to play</p>
                </div>
              </div>
            )}
          </div>

          {/* Video Controls */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePauseResume}
                disabled={!currentPlayback}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              <button
                onClick={handleStop}
                disabled={!currentPlayback}
                className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z"/>
                </svg>
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Speed:</span>
                <select
                  value={playbackSpeed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="px-2 py-1 bg-gray-800 border border-gray-600 text-white rounded text-sm focus:outline-none focus:border-blue-500"
                >
                  {playbackSpeeds.map(speed => (
                    <option key={speed} value={speed}>{speed}x</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Progress Bar */}
            {currentPlayback && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-300">{formatTime(currentTime)}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-300">{formatTime(duration)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={(e) => handleSeek(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Timeline View */}
      {showTimeline && selectedCamera && (
        <div className="mt-6 bg-gray-900 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-4">Timeline View</h3>
          <div className="bg-gray-800 rounded-lg p-4 h-24 flex items-center">
            <div className="w-full h-8 bg-gray-700 rounded relative">
              {/* Timeline hours */}
              {Array.from({ length: 24 }, (_, i) => (
                <div
                  key={i}
                  className="absolute top-0 h-full border-l border-gray-600"
                  style={{ left: `${(i / 24) * 100}%` }}
                >
                  <span className="text-xs text-gray-400 absolute -bottom-6 transform -translate-x-1/2">
                    {i.toString().padStart(2, '0')}:00
                  </span>
                </div>
              ))}
              
              {/* Recording segments */}
              {recordings.map((recording, index) => {
                const startHour = parseInt(recording.startTime.split(':')[0]);
                const startMinute = parseInt(recording.startTime.split(':')[1]);
                const endHour = parseInt(recording.endTime.split(':')[0]);
                const endMinute = parseInt(recording.endTime.split(':')[1]);
                
                const startPercent = ((startHour * 60 + startMinute) / (24 * 60)) * 100;
                const endPercent = ((endHour * 60 + endMinute) / (24 * 60)) * 100;
                const width = endPercent - startPercent;
                
                return (
                  <div
                    key={index}
                    className={`absolute top-1 h-6 rounded cursor-pointer ${
                      recording.type === 'motion' ? 'bg-red-500' : 
                      recording.type === 'scheduled' ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ left: `${startPercent}%`, width: `${width}%` }}
                    onClick={() => handlePlayRecording(recording)}
                    title={`${recording.type} recording: ${recording.startTime} - ${recording.endTime}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaybackView;
