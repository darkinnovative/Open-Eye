"""
FastAPI WebSocket Server for NVR Live Video Streaming
This is an example backend implementation that works with the React frontend
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
import base64
import cv2
import numpy as np
from typing import Dict, List
import logging
from datetime import datetime
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="NVR WebSocket Server", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state
active_connections: Dict[str, WebSocket] = {}
camera_streams: Dict[str, dict] = {}
recording_sessions: Dict[str, dict] = {}

# Mock camera data
MOCK_CAMERAS = [
    {
        "id": "1",
        "name": "Front Door",
        "ip": "192.168.1.100",
        "port": 8080,
        "status": "online",
        "stream_url": "rtsp://192.168.1.100:554/stream1",
        "type": "IP",
        "resolution": "1920x1080",
        "fps": 30,
        "location": "Entrance"
    },
    {
        "id": "2",
        "name": "Back Yard",
        "ip": "192.168.1.101",
        "port": 8080,
        "status": "online",
        "stream_url": "rtsp://192.168.1.101:554/stream1",
        "type": "IP",
        "resolution": "1920x1080",
        "fps": 25,
        "location": "Garden"
    },
    {
        "id": "3",
        "name": "Living Room",
        "ip": "192.168.1.102",
        "port": 8080,
        "status": "online",
        "stream_url": "rtsp://192.168.1.102:554/stream1",
        "type": "IP",
        "resolution": "1920x1080",
        "fps": 30,
        "location": "Indoor"
    },
    {
        "id": "4",
        "name": "Garage",
        "ip": "192.168.1.103",
        "port": 8080,
        "status": "offline",
        "stream_url": "rtsp://192.168.1.103:554/stream1",
        "type": "IP",
        "resolution": "1920x1080",
        "fps": 30,
        "location": "Garage"
    },
    {
        "id": "5",
        "name": "Parking Lot",
        "ip": "192.168.1.104",
        "port": 8080,
        "status": "online",
        "stream_url": "rtsp://192.168.1.104:554/stream1",
        "type": "IP",
        "resolution": "1920x1080",
        "fps": 25,
        "location": "Outdoor"
    }
]

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        
    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        logger.info(f"Client {client_id} connected")
        
    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            logger.info(f"Client {client_id} disconnected")
            
    async def send_to_client(self, client_id: str, message: dict):
        if client_id in self.active_connections:
            try:
                await self.active_connections[client_id].send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error sending message to {client_id}: {e}")
                self.disconnect(client_id)
                
    async def broadcast(self, message: dict):
        disconnected_clients = []
        for client_id, connection in self.active_connections.items():
            try:
                await connection.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error broadcasting to {client_id}: {e}")
                disconnected_clients.append(client_id)
        
        for client_id in disconnected_clients:
            self.disconnect(client_id)

manager = ConnectionManager()

async def simulate_mjpeg_stream(camera_id: str, client_id: str):
    """Simulate MJPEG stream with generated frames"""
    try:
        frame_count = 0
        while client_id in manager.active_connections:
            # Generate a simple test frame
            frame = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
            
            # Add timestamp and camera info
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cv2.putText(frame, f"Camera {camera_id}", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
            cv2.putText(frame, timestamp, (10, 70), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(frame, f"Frame: {frame_count}", (10, 110), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            
            # Encode frame as JPEG
            _, buffer = cv2.imencode('.jpg', frame)
            frame_data = base64.b64encode(buffer).decode('utf-8')
            
            # Send frame to client
            await manager.send_to_client(client_id, {
                "type": "stream_data",
                "data": {
                    "camera_id": camera_id,
                    "stream_type": "mjpeg",
                    "data": frame_data
                }
            })
            
            frame_count += 1
            await asyncio.sleep(0.1)  # 10 FPS
            
    except Exception as e:
        logger.error(f"Error in MJPEG stream for camera {camera_id}: {e}")
    finally:
        if camera_id in camera_streams:
            del camera_streams[camera_id]

async def simulate_hls_stream(camera_id: str, client_id: str):
    """Simulate HLS stream updates"""
    try:
        playlist_count = 0
        while client_id in manager.active_connections:
            # Simulate HLS playlist update
            playlist_url = f"http://localhost:8000/hls/{camera_id}/playlist_{playlist_count}.m3u8"
            
            await manager.send_to_client(client_id, {
                "type": "stream_data",
                "data": {
                    "camera_id": camera_id,
                    "stream_type": "hls",
                    "data": {
                        "playlist_url": playlist_url,
                        "segment_duration": 6.0
                    }
                }
            })
            
            playlist_count += 1
            await asyncio.sleep(6.0)  # Update every 6 seconds
            
    except Exception as e:
        logger.error(f"Error in HLS stream for camera {camera_id}: {e}")
    finally:
        if camera_id in camera_streams:
            del camera_streams[camera_id]

async def handle_start_stream(client_id: str, data: dict):
    """Handle stream start request"""
    camera_id = data.get("camera_id")
    stream_type = data.get("stream_type", "hls")
    
    # Find camera
    camera = next((c for c in MOCK_CAMERAS if c["id"] == camera_id), None)
    if not camera:
        await manager.send_to_client(client_id, {
            "type": "error",
            "data": {"message": f"Camera {camera_id} not found"}
        })
        return
    
    if camera["status"] != "online":
        await manager.send_to_client(client_id, {
            "type": "error",
            "data": {"message": f"Camera {camera_id} is offline"}
        })
        return
    
    # Stop existing stream if any
    if camera_id in camera_streams:
        camera_streams[camera_id]["task"].cancel()
    
    # Start new stream
    if stream_type == "mjpeg":
        task = asyncio.create_task(simulate_mjpeg_stream(camera_id, client_id))
    elif stream_type == "hls":
        task = asyncio.create_task(simulate_hls_stream(camera_id, client_id))
    elif stream_type == "webrtc":
        # For WebRTC, we would handle signaling here
        await manager.send_to_client(client_id, {
            "type": "stream_data",
            "data": {
                "camera_id": camera_id,
                "stream_type": "webrtc",
                "data": {
                    "type": "offer",
                    "offer": {
                        "type": "offer",
                        "sdp": "v=0\\r\\no=- 0 0 IN IP4 127.0.0.1\\r\\n..."  # Mock SDP
                    }
                }
            }
        })
        return
    
    camera_streams[camera_id] = {
        "task": task,
        "stream_type": stream_type,
        "client_id": client_id
    }
    
    # Send stream health update
    await manager.send_to_client(client_id, {
        "type": "stream_health",
        "data": {
            "camera_id": camera_id,
            "health": {
                "status": "connected",
                "lastUpdate": datetime.now().isoformat()
            }
        }
    })

async def handle_stop_stream(client_id: str, data: dict):
    """Handle stream stop request"""
    camera_id = data.get("camera_id")
    
    if camera_id in camera_streams:
        camera_streams[camera_id]["task"].cancel()
        del camera_streams[camera_id]
        
        await manager.send_to_client(client_id, {
            "type": "stream_health",
            "data": {
                "camera_id": camera_id,
                "health": {
                    "status": "disconnected",
                    "lastUpdate": datetime.now().isoformat()
                }
            }
        })

async def handle_start_recording(client_id: str, data: dict):
    """Handle recording start request"""
    camera_id = data.get("camera_id")
    duration = data.get("duration", 30)
    
    # Simulate recording
    recording_id = f"rec_{camera_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    recording_sessions[recording_id] = {
        "camera_id": camera_id,
        "start_time": datetime.now(),
        "duration": duration,
        "client_id": client_id
    }
    
    await manager.send_to_client(client_id, {
        "type": "recording_status",
        "data": {
            "camera_id": camera_id,
            "is_recording": True,
            "recording_id": recording_id
        }
    })
    
    # Auto-stop recording after duration
    async def auto_stop():
        await asyncio.sleep(duration)
        if recording_id in recording_sessions:
            del recording_sessions[recording_id]
            await manager.send_to_client(client_id, {
                "type": "recording_status",
                "data": {
                    "camera_id": camera_id,
                    "is_recording": False,
                    "recording_id": recording_id,
                    "file_path": f"/recordings/{recording_id}.mp4"
                }
            })
    
    asyncio.create_task(auto_stop())

async def handle_stop_recording(client_id: str, data: dict):
    """Handle recording stop request"""
    camera_id = data.get("camera_id")
    
    # Find and stop recording
    recording_to_stop = None
    for rec_id, recording in recording_sessions.items():
        if recording["camera_id"] == camera_id and recording["client_id"] == client_id:
            recording_to_stop = rec_id
            break
    
    if recording_to_stop:
        del recording_sessions[recording_to_stop]
        await manager.send_to_client(client_id, {
            "type": "recording_status",
            "data": {
                "camera_id": camera_id,
                "is_recording": False,
                "recording_id": recording_to_stop,
                "file_path": f"/recordings/{recording_to_stop}.mp4"
            }
        })

async def handle_take_snapshot(client_id: str, data: dict):
    """Handle snapshot request"""
    camera_id = data.get("camera_id")
    
    # Simulate snapshot capture
    snapshot_id = f"snap_{camera_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    await manager.send_to_client(client_id, {
        "type": "snapshot_taken",
        "data": {
            "camera_id": camera_id,
            "snapshot_id": snapshot_id,
            "file_path": f"/snapshots/{snapshot_id}.jpg",
            "timestamp": datetime.now().isoformat()
        }
    })

@app.websocket("/ws/live")
async def websocket_live(websocket: WebSocket):
    client_id = f"client_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"
    await manager.connect(websocket, client_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            message_type = message.get("type")
            message_data = message.get("data", {})
            
            if message_type == "get_cameras":
                await manager.send_to_client(client_id, {
                    "type": "camera_list",
                    "data": MOCK_CAMERAS
                })
                
            elif message_type == "start_stream":
                await handle_start_stream(client_id, message_data)
                
            elif message_type == "stop_stream":
                await handle_stop_stream(client_id, message_data)
                
            elif message_type == "start_recording":
                await handle_start_recording(client_id, message_data)
                
            elif message_type == "stop_recording":
                await handle_stop_recording(client_id, message_data)
                
            elif message_type == "take_snapshot":
                await handle_take_snapshot(client_id, message_data)
                
            elif message_type == "webrtc_answer":
                # Handle WebRTC answer
                logger.info(f"Received WebRTC answer from {client_id}")
                
            elif message_type == "webrtc_ice_candidate":
                # Handle ICE candidate
                logger.info(f"Received ICE candidate from {client_id}")
                
            elif message_type == "webrtc_offer_request":
                # Handle WebRTC offer request
                camera_id = message_data.get("camera_id")
                await manager.send_to_client(client_id, {
                    "type": "stream_data",
                    "data": {
                        "camera_id": camera_id,
                        "stream_type": "webrtc",
                        "data": {
                            "type": "offer",
                            "offer": {
                                "type": "offer",
                                "sdp": "v=0\\r\\no=- 0 0 IN IP4 127.0.0.1\\r\\n..."  # Mock SDP
                            }
                        }
                    }
                })
                
            else:
                logger.warning(f"Unknown message type: {message_type}")
                
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        # Clean up streams for this client
        streams_to_remove = []
        for camera_id, stream_info in camera_streams.items():
            if stream_info["client_id"] == client_id:
                stream_info["task"].cancel()
                streams_to_remove.append(camera_id)
        
        for camera_id in streams_to_remove:
            del camera_streams[camera_id]

@app.get("/")
async def root():
    return {"message": "NVR WebSocket Server is running"}

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "active_connections": len(manager.active_connections),
        "active_streams": len(camera_streams),
        "active_recordings": len(recording_sessions)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
