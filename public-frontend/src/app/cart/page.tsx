'use client';

import React, { useState } from 'react';
import { FiShoppingCart, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import CartItemsList from '@/components/cart/CartItemsList';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import StoreSummary from '@/components/cart/StoreSummary';

// Mock data - in a real app this would come from a state management solution or API
import { useCartItems } from '@/hooks/useCartItems';
import Header from '@/components/layout/Header/Header';
import MobileHeader from '@/components/layout/Header/MobileHeader';

export default function CartPage() {
  const { cartItems, storeGroups, totalPrice, updateQuantity, removeItem } = useCartItems();
  const [collapsedStores, setCollapsedStores] = useState<string[]>([]);
  
  const toggleStoreExpansion = (storeId: string) => {
    if (collapsedStores.includes(storeId)) {
      // If it's collapsed, expand it by removing from collapsed list
      setCollapsedStores(collapsedStores.filter(id => id !== storeId));
    } else {
      // If it's expanded, collapse it by adding to collapsed list
      setCollapsedStores([...collapsedStores, storeId]);
    }
  };

  // Find store info from the first item in each group
  const getStoreInfo = (storeId: string) => {
    const item = cartItems.find(item => item.store.id === storeId);
    return item ? item.store : null;
  };

  return (
    <div className="">
       <Header />
       <MobileHeader />
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-8 flex items-center">
          <FiShoppingCart className="ml-2" />
          سبد خرید
        </h1>

        {cartItems.length === 0 ? (
          <div className="bg-primary-800/80 backdrop-blur-sm rounded-lg shadow-md border border-primary-700 p-6">
            <EmptyCart />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* لیست محصولات بر اساس فروشگاه */}
            <div className="lg:col-span-2 space-y-6">
              {storeGroups.map(store => {
                const storeInfo = getStoreInfo(store.storeId);
                const isCollapsed = collapsedStores.includes(store.storeId);
                
                return (
                  <div key={store.storeId} className="bg-primary-800/80 backdrop-blur-sm rounded-lg shadow-md border border-primary-700">
                    <div 
                      className="p-4 border-b border-primary-700 bg-primary-700/30 rounded-t-lg flex justify-between items-center cursor-pointer"
                      onClick={() => toggleStoreExpansion(store.storeId)}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={storeInfo?.logo} 
                          alt={store.storeName}
                          className="w-12 h-12 rounded-full border-2 border-primary-700 object-cover"
                        />
                        <div>
                          <h2 className="text-sm font-medium text-white">{store.storeName}</h2>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="text-xs text-primary-400">
                              <span className="ml-1">طبقه:</span>
                              <span className="text-primary-300">{storeInfo?.floor}</span>
                            </div>
                            <div className="text-xs text-primary-400">
                              <span className="ml-1">پلاک:</span>
                              <span className="text-primary-300">{storeInfo?.unit}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-primary-300 text-sm">
                          {store.items.length} محصول | {store.totalPrice.toLocaleString()} تومان
                        </div>
                        {isCollapsed ? <FiChevronDown className="text-primary-400" /> : <FiChevronUp className="text-primary-400" />}
                      </div>
                    </div>
                    
                    <div className={`transition-all duration-300 ${!isCollapsed ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                      <div className="p-6">
                        <CartItemsList 
                          items={store.items} 
                          onUpdateQuantity={updateQuantity} 
                          onRemoveItem={removeItem} 
                        />
                        
                        <div className="mt-6 pt-4 border-t border-primary-700">
                          <StoreSummary 
                            totalPrice={store.totalPrice}
                            shippingCost={0}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* خلاصه کل سبد خرید */}
            <div className="lg:col-span-1">
              <CartSummary 
                totalPrice={totalPrice} 
                shippingCost={0} 
                storeCount={storeGroups.length} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 