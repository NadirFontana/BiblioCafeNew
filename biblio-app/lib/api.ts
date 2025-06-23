// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface Category {
  id: string;
  name: string;
  emoji: string;
  order_index: number;
}

export interface Product {
  id: number;
  category_id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  order_index: number;
}

// Categories API
export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Errore nel recupero delle categorie');
    }
    return response.json();
  },

  create: async (category: Omit<Category, 'order_index'> & { order_index?: number }): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error('Errore nella creazione della categoria');
    }
  },

  update: async (category: Category): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) {
      throw new Error('Errore nell\'aggiornamento della categoria');
    }
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/categories?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Errore nell\'eliminazione della categoria');
    }
  },
};

// Products API
export const productsApi = {  getAll: async (categoryId?: string): Promise<Product[]> => {
    const url = categoryId 
      ? `${API_BASE_URL}/products?category=${categoryId}`
      : `${API_BASE_URL}/products`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Errore nel recupero dei prodotti');
    }
    const products = await response.json();
    
    // Converti i prezzi da stringa a numero
    return products.map((product: any) => ({
      ...product,
      price: Number(product.price)
    }));
  },

  create: async (product: Omit<Product, 'id'>): Promise<{ success: boolean; id: number }> => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Errore nella creazione del prodotto');
    }
    return response.json();
  },

  update: async (product: Product): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Errore nell\'aggiornamento del prodotto');
    }
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/products?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Errore nell\'eliminazione del prodotto');
    }
  },
};
