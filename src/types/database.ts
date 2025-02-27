export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}