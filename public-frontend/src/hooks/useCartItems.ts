import { useState } from 'react';
import { CartItem } from '@/types/cart';

// Mock data for demo purposes
const initialCartItems: CartItem[] = [
  {
    id: '1',
    name: 'کفش ورزشی نایک',
    price: 1200000,
    quantity: 1,
    image: '/product1.jpg',
    color: 'مشکی',
    specifications: [
      { key: 'سایز', value: '42' },
      { key: 'وزن', value: '380 گرم' }
    ],
    store: {
      id: '1',
      name: 'فروشگاه کفش ورزشی',
      logo: '/store1.jpg',
      floor: '3',
      unit: '25'
    }
  },
  {
    id: '2',
    name: 'شلوار جین',
    price: 850000,
    quantity: 2,
    image: '/product2.jpg',
    color: 'آبی تیره',
    specifications: [
      { key: 'سایز', value: '32' }
    ],
    store: {
      id: '2',
      name: 'فروشگاه پوشاک',
      logo: '/store2.jpg',
      floor: '2',
      unit: '18'
    }
  },
  {
    id: '3',
    name: 'تیشرت آستین کوتاه',
    price: 350000,
    quantity: 1,
    image: '/product3.jpg',
    color: 'سفید',
    store: {
      id: '2',
      name: 'فروشگاه پوشاک',
      logo: '/store2.jpg',
      floor: '2',
      unit: '18'
    }
  },
  {
    id: '4',
    name: 'کت چرم',
    price: 1950000,
    quantity: 1,
    image: '/product4.jpg',
    specifications: [
      { key: 'جنس', value: 'چرم طبیعی' },
      { key: 'قد', value: '75 سانتی‌متر' }
    ],
    store: {
      id: '3',
      name: 'فروشگاه اکسسوری',
      logo: '/store3.jpg',
      floor: '1',
      unit: '10'
    }
  }
];

interface StoreGroup {
  storeId: string;
  storeName: string;
  items: CartItem[];
  totalPrice: number;
}

export const useCartItems = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);

  // گروه‌بندی محصولات بر اساس فروشگاه
  const groupedByStore = cartItems.reduce((groups: StoreGroup[], item) => {
    const existingGroup = groups.find(group => group.storeId === item.store.id);
    
    if (existingGroup) {
      existingGroup.items.push(item);
      existingGroup.totalPrice += item.price * item.quantity;
    } else {
      groups.push({
        storeId: item.store.id,
        storeName: item.store.name,
        items: [item],
        totalPrice: item.price * item.quantity
      });
    }
    
    return groups;
  }, []);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(
      cartItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const addItem = (item: CartItem) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return {
    cartItems,
    storeGroups: groupedByStore,
    totalPrice,
    updateQuantity,
    removeItem,
    addItem,
    clearCart
  };
}; 