import { supabase } from '../lib/supabase';
import { Product, Admin } from '../types/database';
import { History } from '../types/database';

// Products API
export const productsApi = {
  // Get all products
  getAll: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Product[];
  },

  // Get product by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Product;
  },

  // Create new product
  create: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw error;
    return data as Product;
  },

  // Update product
  update: async (id: string, product: Partial<Product>) => {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Product;
  },

  // Delete product
  delete: async (id: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Admins API
export const adminsApi = {
  // Get all admins
  getAll: async () => {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Admin[];
  },

  // Get admin by ID
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Admin;
  },

  // Update admin
  update: async (id: string, admin: Partial<Admin>) => {
    const { data, error } = await supabase
      .from('admins')
      .update(admin)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Admin;
  }
  
};
export const historyApi = {
  // Get all history (incoming & outgoing products)
  getAll: async () => {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as History[];
  }
};