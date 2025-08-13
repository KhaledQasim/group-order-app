# 🍕 Bella Italia - Group Ordering App

A real-time group ordering application built with Next.js, TypeScript, Tailwind CSS, and Socket.IO. Multiple users can join a shared room and collaboratively build an order together.

## ✨ Features

- **Real-time synchronization** - All changes sync instantly across all devices
- **QR Code sharing** - Easy room joining via QR code or shareable link
- **Mobile-first design** - Optimized for phone usage
- **Italian restaurant theme** - Pizza sizes (small, medium, large) and other menu items
- **Group cart management** - See who added what to the shared cart
- **Host/participant roles** - Room creator becomes the host

## 🚀 Getting Started

### 1. Start the WebSocket Server
In the first terminal, run:
```bash
npm run socket
```
This starts the WebSocket server on port 3001.

### 2. Start the Next.js App
In a second terminal, run:
```bash
npm run dev
```
This starts the Next.js app on port 3000.

### 3. Open the App
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 How to Use

### Creating a Group Order (Host)
1. Click the green "Group Order" button in the top right
2. Enter your name
3. Click "Create Room"
4. Share the QR code or link with others

### Joining a Group Order (Participant)
1. Scan the QR code or open the shared link
2. Enter your name
3. Start adding items to the shared cart

### Adding Items
1. Browse the menu by category
2. Select pizza sizes (small, medium, large) where applicable
3. Adjust quantity with +/- buttons
4. Click "Add to Cart"

### Managing the Cart
1. Click the "Cart" button to view shared items
2. See who added each item
3. Adjust quantities or remove items
4. Place the group order when ready

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Real-time**: Socket.IO
- **QR Codes**: react-qr-code
- **UI Components**: Custom responsive components

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page with Suspense wrapper
│   └── globals.css         # Global styles and Tailwind
├── components/
│   ├── GroupOrderApp.tsx   # Main app component
│   ├── GroupOrderModal.tsx # Room creation/joining modal
│   ├── MenuItem.tsx        # Individual menu item
│   └── Cart.tsx           # Shared cart component
├── lib/
│   └── menuData.ts        # Restaurant menu data
└── types/
    └── index.ts           # TypeScript type definitions
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run socket` - Start WebSocket server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Features Implementation

- **WebSocket Integration**: Separate Node.js server (`server.js`) handles real-time communication
- **URL Parameters**: Automatic room joining via `?room=<roomId>` URL parameter
- **Responsive Design**: Mobile-first approach with proper touch targets
- **Type Safety**: Full TypeScript implementation with custom types

## 📸 Screenshots

The app features:
- Red primary theme with white background
- Italian restaurant branding
- Mobile-optimized interface
- Real-time cart updates
- QR code generation for easy sharing

## 🚨 Important Notes

1. **Two Servers Required**: You must run both the WebSocket server (`npm run socket`) and the Next.js app (`npm run dev`) simultaneously
2. **Mobile Focus**: The app is designed primarily for mobile devices
3. **In-Memory Storage**: Cart data is stored in memory and will reset when the WebSocket server restarts
4. **Local Development**: Currently configured for localhost - update server URLs for production deployment

## 🔮 Future Enhancements

- Persistent cart storage
- User authentication
- Order history
- Payment integration
- Restaurant management panel
- Push notifications
