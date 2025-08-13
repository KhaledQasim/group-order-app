const { Server } = require('socket.io');
const http = require('http');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"]
  }
});

// In-memory storage for rooms
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-room', (data) => {
    const { roomId, participantName, userId } = data;
    
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
              rooms.set(roomId, {
          id: roomId,
          hostId: socket.id,
          hostName: participantName,
          hostUserId: userId,
          participants: [],
          cart: [],
          createdAt: new Date()
        });
    }

    const room = rooms.get(roomId);
          const participant = {
        id: socket.id,
        name: participantName,
        userId: userId,
        joinedAt: new Date()
      };

    room.participants.push(participant);
    
    socket.emit('room-updated', { room });
    socket.to(roomId).emit('participant-joined', { participant });
    
    console.log(`User ${participantName} joined room ${roomId}`);
  });

  socket.on('add-to-cart', (data) => {
    const { roomId, item, userId } = data;
    const room = rooms.get(roomId);
    
    if (room && item.addedByUserId === userId) {
      room.cart.push(item);
      io.to(roomId).emit('room-updated', { room });
    }
  });

  socket.on('remove-from-cart', (data) => {
    const { roomId, itemId, userId } = data;
    const room = rooms.get(roomId);
    
    if (room) {
      const item = room.cart.find(item => item.id === itemId);
      if (item && item.addedByUserId === userId) {
        room.cart = room.cart.filter(item => item.id !== itemId);
        io.to(roomId).emit('room-updated', { room });
      }
    }
  });

  socket.on('update-cart-item', (data) => {
    const { roomId, itemId, quantity, userId } = data;
    const room = rooms.get(roomId);
    
    if (room) {
      const item = room.cart.find(item => item.id === itemId);
      if (item && item.addedByUserId === userId) {
        item.quantity = quantity;
        io.to(roomId).emit('room-updated', { room });
      }
    }
  });

  socket.on('place-order', (data) => {
    const { roomId, hostUserId } = data;
    const room = rooms.get(roomId);
    
    // Verify that the person placing the order is the host
    if (room && room.hostUserId === hostUserId) {
      console.log(`Host ${room.hostName} is placing order for room ${roomId}`);
      // Emit bell notification to all participants in the room
      io.to(roomId).emit('order-notification', { 
        message: `${room.hostName} is placing the group order!`,
        hostName: room.hostName 
      });
    }
  });

  socket.on('yalla-bell', (data) => {
    const { roomId, senderName, userId } = data;
    const room = rooms.get(roomId);
    
    // Verify that the sender is actually in the room
    if (room) {
      const participant = room.participants.find(p => p.userId === userId);
      if (participant) {
        console.log(`${senderName} rang the YALLA bell in room ${roomId}`);
        // Emit YALLA bell to ALL participants in the room (including sender)
        io.to(roomId).emit('yalla-bell', { 
          senderName: senderName,
          message: `${senderName} says YALLA! 🔔`
        });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Remove participant from all rooms
    for (const [roomId, room] of rooms.entries()) {
      const participantIndex = room.participants.findIndex(p => p.id === socket.id);
      if (participantIndex !== -1) {
        const participant = room.participants[participantIndex];
        room.participants.splice(participantIndex, 1);
        
        // If no participants left, delete the room
        if (room.participants.length === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit('participant-left', { participantId: socket.id });
          io.to(roomId).emit('room-updated', { room });
        }
      }
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
}); 