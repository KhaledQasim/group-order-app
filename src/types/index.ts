export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes?: {
    small?: number;
    medium?: number;
    large?: number;
  };
  availableSizes?: string[];
}

export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  addedBy: string;
  addedAt: Date;
}

export interface Room {
  id: string;
  hostId: string;
  hostName: string;
  participants: Participant[];
  cart: CartItem[];
  createdAt: Date;
}

export interface Participant {
  id: string;
  name: string;
  joinedAt: Date;
}

export interface SocketEvents {
  'join-room': (data: { roomId: string; participantName: string }) => void;
  'leave-room': (data: { roomId: string; participantId: string }) => void;
  'add-to-cart': (data: { roomId: string; item: CartItem }) => void;
  'remove-from-cart': (data: { roomId: string; itemId: string }) => void;
  'update-cart-item': (data: { roomId: string; itemId: string; quantity: number }) => void;
  'room-updated': (data: { room: Room }) => void;
  'participant-joined': (data: { participant: Participant }) => void;
  'participant-left': (data: { participantId: string }) => void;
} 