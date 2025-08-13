'use client';

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { v4 as uuidv4 } from 'uuid';

interface GroupOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinRoom: (roomId: string, participantName: string) => void;
  urlRoomId?: string;
}

export default function GroupOrderModal({ isOpen, onClose, onJoinRoom, urlRoomId }: GroupOrderModalProps) {
  const [roomId, setRoomId] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [hostName, setHostName] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (urlRoomId) {
        // Joining existing room via URL
        setRoomId(urlRoomId);
        setIsHost(false);
        setShareUrl(''); // Clear share URL for joining
      } else if (!roomId) {
        // Creating new room
        const newRoomId = uuidv4();
        setRoomId(newRoomId);
        // Don't set shareUrl here, wait for user to create room
      }
    }
  }, [isOpen, roomId, urlRoomId]);

  const handleCreateRoom = () => {
    if (participantName.trim()) {
      setIsHost(true);
      setHostName(participantName); // Preserve the host's name
      setShareUrl(`${window.location.origin}?room=${roomId}`);
      // Don't auto-join, let the host decide when to join
    }
  };

  const handleJoinRoom = () => {
    if (participantName.trim()) {
      setIsHost(false);
      onJoinRoom(roomId, participantName);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // Reset states when modal closes
      setRoomId('');
      setParticipantName('');
      setIsHost(false);
      setShareUrl('');
      setHostName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {isHost ? 'Share Group Order' : 'Join Group Order'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {!shareUrl ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            {!urlRoomId && (
              <>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCreateRoom}
                    disabled={!participantName.trim()}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Create Room
                  </button>
                </div>
                
                <div className="text-center text-gray-500 text-sm">
                  Or join existing room:
                </div>
              </>
            )}
            
            {urlRoomId && (
              <div className="text-center text-green-600 text-sm mb-2">
                Joining room: <span className="font-mono">{urlRoomId.slice(0, 8)}...</span>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room ID
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              onClick={handleJoinRoom}
              disabled={!participantName.trim() || (!urlRoomId && !roomId.trim())}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {urlRoomId ? 'Join Room' : 'Join Room'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Room created by: <span className="font-semibold text-black">{hostName || 'Host'}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Share this link or QR code with others, then join yourself.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <QRCode
                  value={shareUrl}
                  size={200}
                  level="H"
                  className="mx-auto"
                />
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                >
                  Copy
                </button>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Room ID: <span className="font-mono text-red-600">{roomId}</span>
                </p>
                
                <button
                  onClick={() => onJoinRoom(roomId, hostName || 'Host')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-semibold"
                >
                  Join My Room as {hostName || 'Host'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 