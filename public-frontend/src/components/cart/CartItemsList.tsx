import React from 'react';
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { CartItem } from '@/types/cart';

interface CartItemsListProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartItemsList: React.FC<CartItemsListProps> = ({ items, onUpdateQuantity, onRemoveItem }) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 border border-primary-500/30 last:border-0 rounded-lg shadow-lg backdrop-blur-sm">
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg border-2 border-primary-400/50 shadow-md hover:scale-105 transition-transform duration-300"
          />
          <div className="sm:mr-4 flex-grow mt-3 sm:mt-0">
            <h3 className="font-medium text-white text-base">{item.name}</h3>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {item.color && (
                <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium text-xs px-3 py-1 rounded-md shadow-sm">
                  رنگ: {item.color}
                </div>
              )}
              
              {item.specifications && item.specifications.map((spec, index) => (
                <div key={index} className="bg-gradient-to-r from-primary-700/90 to-primary-600/90 text-primary-200 font-medium text-xs px-3 py-1 rounded-md shadow-sm">
                  {spec.key}: <span className="text-white">{spec.value}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center mt-3">
              <button 
                className="text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 h-7 w-7 rounded-full flex items-center justify-center transition-all shadow-sm"
                onClick={() => item.quantity > 1 && onUpdateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <FiMinus size={16} />
              </button>
              <span className="mx-2 w-8 text-center text-white font-medium">{item.quantity}</span>
              <button 
                className="text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 h-7 w-7 rounded-full flex items-center justify-center transition-all shadow-sm"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              >
                <FiPlus size={16} />
              </button>
            </div>
          </div>
          <div className="text-left sm:text-right mt-3 sm:mt-0 self-end sm:self-start">
            <p className="font-bold text-white text-base">
              {item.price.toLocaleString()} <span className="text-primary-300">تومان</span>
            </p>
            <p className="text-sm text-primary-300 font-medium mt-1">
              قیمت کل: <span className="text-white">{(item.price * item.quantity).toLocaleString()}</span> <span className="text-primary-400">تومان</span>
            </p>
            <button 
              className="text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 p-2 rounded-full mt-2 transition-all"
              onClick={() => onRemoveItem(item.id)}
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItemsList; 