'use client';

import { useState } from 'react';
import { MenuItem as MenuItemType, CartItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (cartItem: CartItem) => void;
}

export default function MenuItem({ item, onAddToCart }: MenuItemProps) {
  const [selectedSize, setSelectedSize] = useState<string>('medium');
  const [quantity, setQuantity] = useState(1);

  const getPrice = () => {
    if (item.sizes && selectedSize) {
      return item.sizes[selectedSize as keyof typeof item.sizes] || item.price;
    }
    return item.price;
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: uuidv4(),
      menuItemId: item.id,
      name: `${item.name}${item.sizes ? ` (${selectedSize})` : ''}`,
      price: getPrice(),
      quantity,
      size: item.sizes ? selectedSize : undefined,
      addedBy: 'User', // This will be replaced with actual user name
      addedAt: new Date()
    };
    onAddToCart(cartItem);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="w-full h-full flex items-center justify-center">
                  <div class="text-gray-500 text-center">
                    <div class="text-4xl mb-2">🍕</div>
                    <div class="text-sm">${item.name}</div>
                  </div>
                </div>
              `;
            }
          }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-black mb-2">{item.name}</h3>
        <p className="text-gray-700 text-sm mb-3">{item.description}</p>
        
        {item.availableSizes && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-black mb-2">
              Size
            </label>
            <div className="flex space-x-2">
              {item.availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    selectedSize === size
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 font-bold"
            >
              -
            </button>
            <span className="text-lg font-medium text-black">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 font-bold"
            >
              +
            </button>
          </div>
          <div className="text-lg font-bold text-red-600">
            ${(getPrice() * quantity).toFixed(2)}
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
} 