// app/admin/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { categoriesApi, productsApi, type Category, type Product } from '../../lib/api';

export default function AdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'products' | 'productForm' | 'categoryManagement' | 'categoryForm' | 'qrCode'>('products');
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [notification, setNotification] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categoryFormMode, setCategoryFormMode] = useState<'add' | 'edit' | 'delete'>('add');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Carica categorie
      const categoriesData = await categoriesApi.getAll();
      setCategories(categoriesData);
      
      // Carica tutti i prodotti
      const productsData = await productsApi.getAll();
      setProducts(productsData);
      
    } catch (err) {
      console.error('Errore nel caricamento dei dati:', err);
      showNotification('Errore nel caricamento dei dati');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    
    // Credenziali hardcoded (in produzione dovrebbero venire da variabili ambiente)
    if (loginForm.username === 'caffetteria' && loginForm.password === 'menu2024') {
      setIsLoggedIn(true);
      showNotification('Login effettuato con successo');
    } else {
      showNotification('Credenziali non valide');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ username: '', password: '' });
    setCurrentView('products');
    showNotification('Logout effettuato');
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? `${category.emoji} ${category.name}` : categoryId;
  };

  const getFilteredProducts = () => {
    return currentFilter ? products.filter(p => p.category_id === currentFilter) : products;
  };

  const handleSaveProduct = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const productData = {
        category_id: formData.get('category') as string,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        available: true,
        order_index: 0
      };
      
      if (editingProduct) {
        await productsApi.update({
          ...productData,
          id: editingProduct.id
        });
        showNotification('Prodotto modificato con successo');
      } else {
        await productsApi.create(productData);
        showNotification('Prodotto aggiunto con successo');
      }
      
      await loadData(); // Ricarica i dati
      setCurrentView('products');
      setEditingProduct(null);
      
    } catch (err) {
      console.error('Errore nel salvataggio del prodotto:', err);
      showNotification('Errore nel salvataggio del prodotto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      await productsApi.delete(productId);
      showNotification('Prodotto eliminato con successo');
      await loadData(); // Ricarica i dati
    } catch (err) {
      console.error('Errore nell\'eliminazione del prodotto:', err);
      showNotification('Errore nell\'eliminazione del prodotto');
    } finally {
      setIsLoading(false);
    }
  };  const handleSaveCategory = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!editingCategory) {
        showNotification('Errore: dati categoria mancanti');
        return;
      }

      const categoryData = {
        id: editingCategory.id.trim().toLowerCase().replace(/\s+/g, '-'),
        name: editingCategory.name.trim(),
        emoji: editingCategory.emoji.trim(),
        order_index: categories.length
      };

      // Validazione
      if (!categoryData.id || !categoryData.name || !categoryData.emoji) {
        showNotification('Errore: tutti i campi sono obbligatori');
        return;
      }

      // Controlla se l'ID esiste già (solo per nuove categorie)
      if (categoryFormMode === 'add' && categories.some(cat => cat.id === categoryData.id)) {
        showNotification('Errore: ID categoria già esistente');
        return;
      }
      
      if (categoryFormMode === 'add') {
        await categoriesApi.create(categoryData);
        showNotification('Categoria aggiunta con successo');
      } else if (categoryFormMode === 'edit') {
        await categoriesApi.update(categoryData);
        showNotification('Categoria modificata con successo');
      } else if (categoryFormMode === 'delete') {
        await categoriesApi.delete(categoryData.id);
        showNotification('Categoria eliminata con successo');
      }
      
      await loadData(); // Ricarica i dati
      setCurrentView('categoryManagement');
      setEditingCategory(null);
      
    } catch (err) {
      console.error('Errore nell\'operazione sulla categoria:', err);
      showNotification('Errore nell\'operazione sulla categoria');
    } finally {
      setIsLoading(false);
    }
  };

  const printQRCode = () => {
    showNotification('QR Code inviato alla stampante');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {notification}
          </div>
        )}
        
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-slate-800 mb-6">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>              <input
                type="text"
                id="username"
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-slate-900 bg-white"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>              <input
                type="password"
                id="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-slate-900 bg-white"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }    return (
      <div className="min-h-screen bg-slate-50">
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {notification}
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
              <span className="text-slate-700">Caricamento...</span>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-slate-800">BiblioCafè Admin Panel</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">
              {categories.length} categorie • {products.length} prodotti
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>{/* Mobile Categories */}
      <div className="lg:hidden bg-white border-b border-slate-200 p-2">
        <div className="flex overflow-x-auto gap-2 pb-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCurrentFilter(cat.id)}
              className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                currentFilter === cat.id
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
          <button
            onClick={() => setCurrentFilter(null)}
            className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              currentFilter === null
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            📋 Tutti i Prodotti
          </button>
          <button
            onClick={() => { setCurrentView('productForm'); setEditingProduct(null); }}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap hover:bg-blue-700 transition-colors"
          >
            ➕ Aggiungi Prodotto
          </button>
          <button
            onClick={() => setCurrentView('categoryManagement')}
            className="bg-purple-600 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap hover:bg-purple-700 transition-colors"
          >
            📂 Gestisci Categorie
          </button>
          <button
            onClick={() => setCurrentView('qrCode')}
            className="bg-orange-600 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap hover:bg-orange-700 transition-colors"
          >
            📱 QR Code
          </button>
        </div>
      </div>

      <div className="flex">        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-80 bg-white border-r border-slate-200 min-h-screen p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Navigazione</h3>
          <div className="space-y-2">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-slate-600 mb-2 uppercase tracking-wide">Filtri Categoria</h4>
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentFilter(null)}
                  className={`w-full px-4 py-2 rounded-lg text-left transition-colors text-sm ${
                    currentFilter === null
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  📋 Tutti i Prodotti ({products.length})
                </button>
                {categories.map(cat => {
                  const count = products.filter(p => p.category_id === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCurrentFilter(cat.id)}
                      className={`w-full px-4 py-2 rounded-lg text-left transition-colors text-sm ${
                        currentFilter === cat.id
                          ? 'bg-emerald-700 text-white'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {cat.emoji} {cat.name} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <h4 className="text-sm font-medium text-slate-600 mb-2 uppercase tracking-wide">Azioni</h4>
              <div className="space-y-1">
                <button
                  onClick={() => { setCurrentView('productForm'); setEditingProduct(null); }}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg text-left hover:bg-blue-700 transition-colors"
                >
                  ➕ Aggiungi Prodotto
                </button>
                <button
                  onClick={() => setCurrentView('categoryManagement')}
                  className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg text-left hover:bg-purple-700 transition-colors"
                >
                  📂 Gestisci Categorie
                </button>
                <button
                  onClick={() => setCurrentView('qrCode')}
                  className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg text-left hover:bg-orange-700 transition-colors"
                >
                  📱 QR Code
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Products Table */}
          {currentView === 'products' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {getFilteredProducts().map(product => (
                  <div key={product.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-slate-800 text-lg">{product.name}</h3>                      <div className="flex flex-col items-end space-y-1">
                        <span className="text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                          {getCategoryName(product.category_id)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          product.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.available ? 'Disponibile' : 'Non disponibile'}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 leading-relaxed">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg text-emerald-600">€{product.price.toFixed(2)}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setCurrentView('productForm');
                          }}
                          className="bg-emerald-600 text-white px-3 py-1 rounded text-sm hover:bg-emerald-700 transition-colors"
                        >
                          Modifica
                        </button>                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                        >
                          Elimina
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Form */}
          {currentView === 'productForm' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">
                {editingProduct ? 'Modifica Prodotto' : 'Aggiungi Prodotto'}
              </h3>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                    Categoria
                  </label>                  <select
                    name="category"
                    id="category"
                    required
                    defaultValue={editingProduct?.category_id || (categories[0]?.id || '')}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Nome
                  </label>                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    defaultValue={editingProduct?.name || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                    Descrizione
                  </label>                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    required
                    defaultValue={editingProduct?.description || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-2">
                    Prezzo (€)
                  </label>                  <input
                    type="number"
                    name="price"
                    id="price"
                    step="0.10"
                    min="0"
                    required
                    defaultValue={editingProduct?.price || ''}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Salva
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('products')}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Annulla
                  </button>
                </div>
              </form>
            </div>
          )}          {/* Category Management */}
          {currentView === 'categoryManagement' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-lg">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">Gestione Categorie</h3>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-600 mb-3">Categorie esistenti:</h4>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <div key={cat.id} className="flex text-black items-center justify-between bg-slate-50 p-3 rounded-lg">
                      <span className="font-medium">{cat.emoji} {cat.name}</span>
                      <span className="text-xs text-slate-500">ID: {cat.id}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">                <button
                  onClick={() => {
                    setCategoryFormMode('add');
                    setEditingCategory({ id: '', name: '', emoji: '', order_index: 0 });
                    setCurrentView('categoryForm');
                  }}
                  className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  ➕ Aggiungi Categoria
                </button>
                <button
                  onClick={() => {
                    setCategoryFormMode('edit');
                    setEditingCategory(categories[0] || null);
                    setCurrentView('categoryForm');
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={categories.length === 0}
                >
                  ✏️ Modifica Categoria
                </button>
                <button
                  onClick={() => {
                    setCategoryFormMode('delete');
                    setEditingCategory(categories[0] || null);
                    setCurrentView('categoryForm');
                  }}
                  className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  disabled={categories.length === 0}
                >
                  🗑️ Elimina Categoria
                </button>
                <button
                  onClick={() => setCurrentView('products')}
                  className="w-full bg-slate-600 text-white px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  ⬅️ Indietro
                </button>
              </div>
            </div>
          )}          {/* Category Form */}
          {currentView === 'categoryForm' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 max-w-2xl">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">
                {categoryFormMode === 'add' ? 'Aggiungi Categoria' : 
                 categoryFormMode === 'edit' ? 'Modifica Categoria' : 'Elimina Categoria'}
              </h3>
              <form onSubmit={handleSaveCategory} className="space-y-4">
                {(categoryFormMode === 'edit' || categoryFormMode === 'delete') && (
                  <div>
                    <label htmlFor="categoryToEdit" className="block text-sm font-medium text-slate-700 mb-2">
                      Seleziona Categoria
                    </label>
                    <select
                      id="categoryToEdit"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 bg-white"
                      onChange={(e) => {
                        const cat = categories.find(c => c.id === e.target.value);
                        setEditingCategory(cat || null);
                      }}
                      value={editingCategory?.id || ''}
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.emoji} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                  <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700 mb-2">
                    ID Categoria
                    <span className="text-xs text-slate-500 ml-2">(solo lettere minuscole, numeri e trattini)</span>
                  </label>
                  <input
                    type="text"
                    name="categoryId"
                    id="categoryId"
                    required
                    disabled={categoryFormMode === 'delete' || categoryFormMode === 'edit'}
                    value={editingCategory?.id || ''}
                    onChange={(e) => {
                      if (categoryFormMode === 'add') {
                        setEditingCategory(prev => ({ ...prev, id: e.target.value } as Category));
                      }
                    }}
                    pattern="[a-z0-9-]+"
                    title="Solo lettere minuscole, numeri e trattini"
                    placeholder="es: nuova-categoria"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-100 disabled:text-slate-500 text-slate-900 bg-white"
                  />
                </div>
                  <div>
                  <label htmlFor="categoryName" className="block text-sm font-medium text-slate-700 mb-2">
                    Nome Categoria
                  </label>
                  <input
                    type="text"
                    name="categoryName"
                    id="categoryName"
                    required
                    disabled={categoryFormMode === 'delete'}
                    value={editingCategory?.name || ''}
                    onChange={(e) => {
                      setEditingCategory(prev => ({ ...prev, name: e.target.value } as Category));
                    }}
                    placeholder="es: Nuova Categoria"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-100 disabled:text-slate-500 text-slate-900 bg-white"
                  />
                </div>
                  <div>
                  <label htmlFor="categoryEmoji" className="block text-sm font-medium text-slate-700 mb-2">
                    Emoji
                    <span className="text-xs text-slate-500 ml-2">(1-2 caratteri emoji)</span>
                  </label>
                  <input
                    type="text"
                    name="categoryEmoji"
                    id="categoryEmoji"
                    required
                    disabled={categoryFormMode === 'delete'}
                    value={editingCategory?.emoji || ''}
                    onChange={(e) => {
                      setEditingCategory(prev => ({ ...prev, emoji: e.target.value } as Category));
                    }}
                    maxLength={2}
                    placeholder="🍕"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-100 disabled:text-slate-500 text-slate-900 bg-white"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-3 rounded-lg transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                      categoryFormMode === 'delete' 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {isLoading ? 'Caricamento...' : (
                      categoryFormMode === 'add' ? 'Aggiungi' : 
                      categoryFormMode === 'edit' ? 'Modifica' : 'Elimina'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('categoryManagement')}
                    className="bg-slate-600 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Annulla
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* QR Code Panel */}
          {currentView === 'qrCode' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center max-w-2xl">
              <h3 className="text-xl font-semibold text-emerald-800 mb-8">QR Code Menu</h3>
              <div className="flex justify-center mb-8">
                <div className="w-80 h-80 border-2 border-emerald-600 rounded-xl shadow-lg flex items-center justify-center">
                  <Image
                    src="/img/QRMenu.png"
                    alt="QR Code Menu BiblioCafè"
                    width={280}
                    height={280}
                    className="rounded-lg"
                    onError={() => {
                      // Fallback se l'immagine non esiste
                    }}
                  />
                </div>
              </div>
              <p className="text-emerald-600 text-sm mb-6">
                <strong>URL:</strong> Menu Digitale BiblioCafè
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={printQRCode}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  🖨️ Stampa QR Code
                </button>
                <button
                  onClick={() => setCurrentView('products')}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  ⬅️ Indietro
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}