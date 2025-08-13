'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { MenuItem as MenuItemType, CartItem, Room } from '@/types';
import { menuItems, categories } from '@/lib/menuData';
import MenuItem from '@/components/MenuItem';
import GroupOrderModal from '@/components/GroupOrderModal';
import Cart from '@/components/Cart';

export default function GroupOrderApp() {
  const searchParams = useSearchParams();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isGroupOrderModalOpen, setIsGroupOrderModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [participantName, setParticipantName] = useState('');

  // Check for room parameter in URL
  useEffect(() => {
    const roomId = searchParams.get('room');
    if (roomId && !room) {
      setIsGroupOrderModalOpen(true);
    }
  }, [searchParams, room]);

  // Initialize socket connection
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://working-acm-publicly-initially.trycloudflare.com';
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.on('room-updated', (data: { room: Room }) => {
      setRoom(data.room);
      setCartItems(data.room.cart);
    });

    newSocket.on('participant-joined', (data: { participant: { id: string; name: string; joinedAt: Date } }) => {
      console.log('Participant joined:', data.participant);
    });

    newSocket.on('participant-left', (data: { participantId: string }) => {
      console.log('Participant left:', data.participantId);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleJoinRoom = (roomId: string, name: string) => {
    if (socket && name.trim()) {
      setParticipantName(name);
      socket.emit('join-room', { roomId, participantName: name });
      setIsGroupOrderModalOpen(false);
    }
  };

  const handleAddToCart = (cartItem: CartItem) => {
    if (!room) {
      alert('Please join a group order first by clicking the "Group Order" button!');
      return;
    }
    
    if (socket && room) {
      cartItem.addedBy = participantName || 'Anonymous';
      socket.emit('add-to-cart', { roomId: room.id, item: cartItem });
    }
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (socket && room) {
      socket.emit('update-cart-item', { roomId: room.id, itemId, quantity });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (socket && room) {
      socket.emit('remove-from-cart', { roomId: room.id, itemId });
    }
  };

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-red-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">🍕 Bella Italia</h1>
            <p className="text-sm opacity-90">Authentic Italian Cuisine</p>
          </div>
          <div className="flex items-center space-x-2">
            {room && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative bg-white text-red-600 px-3 py-2 rounded-md font-semibold"
              >
                Cart ({cartItemCount})
              </button>
            )}
            <button
              onClick={() => setIsGroupOrderModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
            >
              Group Order
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white p-4 border-b">
        <div className="flex space-x-2 overflow-x-auto">
          {['All', ...categories].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      {/* Group Order Modal */}
      <GroupOrderModal
        isOpen={isGroupOrderModalOpen}
        onClose={() => setIsGroupOrderModalOpen(false)}
        onJoinRoom={handleJoinRoom}
        urlRoomId={searchParams.get('room') || undefined}
      />

      {/* Cart Modal */}
      <Cart
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Room Status */}
      {room && (
        <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <div className="text-sm text-gray-600">
            <div>Room: {room.id.slice(0, 8)}...</div>
            <div>Participants: {room.participants.length}</div>
            <div>Items: {cartItemCount}</div>
          </div>
        </div>
      )}
    </div>
  );
} 