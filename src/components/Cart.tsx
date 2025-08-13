'use client';

import { useState } from 'react';
import { CartItem } from '@/types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  isHost: boolean;
  onPlaceOrder: () => void;
  onYallaBell: () => void;
}

export default function Cart({ items, onUpdateQuantity, onRemoveItem, isOpen, onClose, currentUserId, isHost, onPlaceOrder, onYallaBell }: CartProps) {
  const [expandedPeople, setExpandedPeople] = useState<string[]>([]);
  
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Group items by person
  const itemsByPerson = items.reduce((groups, item) => {
    const person = item.addedBy;
    if (!groups[person]) {
      groups[person] = [];
    }
    groups[person].push(item);
    return groups;
  }, {} as Record<string, CartItem[]>);

  const togglePersonExpanded = (person: string) => {
    setExpandedPeople(prev => 
      prev.includes(person) 
        ? prev.filter(p => p !== person)
        : [...prev, person]
    );
  };

  const getPersonTotal = (personItems: CartItem[]) => {
    return personItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getPersonItemCount = (personItems: CartItem[]) => {
    return personItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const canEditItem = (item: CartItem) => {
    return item.addedByUserId === currentUserId;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Group Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {Object.entries(itemsByPerson).length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">🛒</div>
              <p>Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(itemsByPerson).map(([person, personItems]) => {
                const isExpanded = expandedPeople.includes(person);
                const personTotal = getPersonTotal(personItems);
                const personItemCount = getPersonItemCount(personItems);

                return (
                  <div key={person} className="bg-white rounded-lg overflow-hidden border-2 border-red-200 shadow-md">
                    {/* Person Header */}
                    <button
                      onClick={() => togglePersonExpanded(person)}
                      className="w-full p-4 flex justify-between items-center hover:bg-red-50 transition-colors bg-red-50/30 border-b-2 border-red-200"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {person.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-black">{person}</h3>
                          <p className="text-sm text-gray-600">
                            {personItemCount} items • ${personTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-red-600">
                          ${personTotal.toFixed(2)}
                        </span>
                        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          ▼
                        </div>
                      </div>
                    </button>

                    {/* Person's Items (Collapsible) */}
                    {isExpanded && (
                      <div className="border-t bg-white">
                        {personItems.map((item) => (
                          <div key={item.id} className="p-4 border-b last:border-b-0">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-medium text-black">{item.name}</h4>
                                  {canEditItem(item) && (
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">You</span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                              </div>
                              {canEditItem(item) && (
                                <button
                                  onClick={() => onRemoveItem(item.id)}
                                  className="text-red-500 hover:text-red-700 ml-2"
                                >
                                  ✕
                                </button>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {canEditItem(item) ? (
                                  <>
                                    <button
                                      onClick={() => {
                                        if (item.quantity > 1) {
                                          onUpdateQuantity(item.id, item.quantity - 1);
                                        }
                                      }}
                                      className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 text-sm font-bold"
                                    >
                                      -
                                    </button>
                                    <span className="font-medium text-black">{item.quantity}</span>
                                    <button
                                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                      className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 text-sm font-bold"
                                    >
                                      +
                                    </button>
                                  </>
                                ) : (
                                  <span className="font-medium text-gray-500">Quantity: {item.quantity}</span>
                                )}
                              </div>
                              <div className="text-lg font-bold text-red-600">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {Object.entries(itemsByPerson).length > 0 && (
          <div className="border-t p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-red-600">${total.toFixed(2)}</span>
            </div>
            
            {/* YALLA Bell Button - Available to everyone */}
            <div className="mb-3">
              <button
                onClick={onYallaBell}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 font-bold text-lg"
              >
                🔔 YALLA! (Ring Bell for Everyone)
              </button>
            </div>
            
            {/* Place Order Button - Host only */}
            {isHost ? (
              <button
                onClick={onPlaceOrder}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-semibold"
              >
                🛒 Place Group Order (Host)
              </button>
            ) : (
              <div className="text-center text-gray-500 text-sm py-3">
                Only the host can place the group order
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 