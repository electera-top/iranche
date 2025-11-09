export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  specifications?: {
    key: string;
    value: string;
  }[];
  store: {
    id: string;
    name: string;
    logo: string;
    floor: string;
    unit: string;
  };
} 