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
    const { roomId, participantName } = data;
    
    socket.join(roomId);
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, {
        id: roomId,
        hostId: socket.id,
        hostName: participantName,
        participants: [],
        cart: [],
        createdAt: new Date()
      });
    }

    const room = rooms.get(roomId);
    const participant = {
      id: socket.id,
      name: participantName,
      joinedAt: new Date()
    };

    room.participants.push(participant);
    
    socket.emit('room-updated', { room });
    socket.to(roomId).emit('participant-joined', { participant });
    
    console.log(`User ${participantName} joined room ${roomId}`);
  });

  socket.on('add-to-cart', (data) => {
    const { roomId, item } = data;
    const room = rooms.get(roomId);
    
    if (room) {
      room.cart.push(item);
      io.to(roomId).emit('room-updated', { room });
    }
  });

  socket.on('remove-from-cart', (data) => {
    const { roomId, itemId } = data;
    const room = rooms.get(roomId);
    
    if (room) {
      room.cart = room.cart.filter(item => item.id !== itemId);
      io.to(roomId).emit('room-updated', { room });
    }
  });

  socket.on('update-cart-item', (data) => {
    const { roomId, itemId, quantity } = data;
    const room = rooms.get(roomId);
    
    if (room) {
      const item = room.cart.find(item => item.id === itemId);
      if (item) {
        item.quantity = quantity;
        io.to(roomId).emit('room-updated', { room });
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