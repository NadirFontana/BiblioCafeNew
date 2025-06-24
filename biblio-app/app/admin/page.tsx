// app/admin/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image'
import { categoriesApi, productsApi, type Category, type Product } from '../../lib/api';
import './admin.css';

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
  };

  const handleSaveCategory = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const categoryData = {
        id: formData.get('categoryId') as string,
        name: formData.get('categoryName') as string,
        emoji: formData.get('categoryEmoji') as string,
        order_index: 0
      };

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
      <div className="admin-container">
        {/* Notification */}
        {notification && (
          <div className="notification" style={{ display: 'block' }}>
            {notification}
          </div>
        )}

        <form id="loginForm" onSubmit={handleLogin}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-color)' }}>Admin Login</h2>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              required
              value={loginForm.username}
              onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              required
              value={loginForm.password}
              onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Notification */}
      {notification && (
        <div className="notification" style={{ display: 'block' }}>
          {notification}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '1.5rem',
              height: '1.5rem',
              border: '2px solid #f3f3f3',
              borderTop: '2px solid var(--accent-color)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span>Caricamento...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="admin-header">
        <h1>BiblioCafè Admin Panel</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem' }}>
            {categories.length} categorie • {products.length} prodotti
          </span>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </header>

      {/* Mobile Categories */}
      <div className="categories-mobile">
        <div className="categories-scroll">
          <button
            onClick={() => setCurrentFilter(null)}
            className={`nav-button ${currentFilter === null ? 'active' : ''}`}
          >
            <span className="button-emoji">📋</span>
            <span className="button-text">Tutti i Prodotti</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCurrentFilter(cat.id)}
              className={`nav-button ${currentFilter === cat.id ? 'active' : ''}`}
            >
              <span className="button-emoji">{cat.emoji}</span>
              <span className="button-text">{cat.name}</span>
            </button>
          ))}
          <button
            onClick={() => { setCurrentView('productForm'); setEditingProduct(null); }}
            className="nav-button"
          >
            <span className="button-emoji">➕</span>
            <span className="button-text">Aggiungi</span>
          </button>
          <button
            onClick={() => setCurrentView('categoryManagement')}
            className="nav-button"
          >
            <span className="button-emoji">📂</span>
            <span className="button-text">Categorie</span>
          </button>
          <button
            onClick={() => setCurrentView('qrCode')}
            className="nav-button"
          >
            <span className="button-emoji">📱</span>
            <span className="button-text">QR Code</span>
          </button>
        </div>
      </div>

      <div className="admin-grid">
        {/* Sidebar - Desktop */}
        <aside className="sidebar">

          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-color)', marginBottom: '1rem', textTransform: 'uppercase' }}>
              Filtri Categoria
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => setCurrentFilter(null)}
                className={`btn ${currentFilter === null ? 'active' : ''}`}
                style={{ width: '100%', textAlign: 'left' }}
              >
                <span className="button-emoji">📋</span>
                <span className="button-text">Tutti i Prodotti ({products.length})</span>
              </button>
              {categories.map(cat => {
                const count = products.filter(p => p.category_id === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCurrentFilter(cat.id)}
                    className={`btn ${currentFilter === cat.id ? 'active' : ''}`}
                    style={{ width: '100%', textAlign: 'left' }}
                  >
                    <span className="button-emoji">{cat.emoji}</span>
                    <span className="button-text">{cat.name} ({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--light-bg)', paddingTop: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-color)', marginBottom: '1rem', textTransform: 'uppercase' }}>
              Azioni
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => { setCurrentView('productForm'); setEditingProduct(null); }}
                className="btn"
                style={{ width: '100%' }}
              >
                <span className="button-emoji">➕</span>
                <span className="button-text">Aggiungi Prodotto</span>
              </button>
              <button
                onClick={() => setCurrentView('categoryManagement')}
                className="btn"
                style={{ width: '100%' }}
              >
                <span className="button-emoji">📂</span>
                <span className="button-text">Gestisci Categorie</span>
              </button>
              <button
                onClick={() => setCurrentView('qrCode')}
                className="btn"
                style={{ width: '100%' }}
              >
                <span className="button-emoji">📱</span>
                <span className="button-text">QR Code</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Products Grid */}
          {currentView === 'products' && (
            <div className="products-grid">
              {getFilteredProducts().map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-header">
                    <h3 className="product-title">{product.name}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <span className="product-category">
                        {getCategoryName(product.category_id)}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        background: product.available ? '#d4edda' : '#f8d7da',
                        color: product.available ? '#155724' : '#721c24'
                      }}>
                        {product.available ? 'Disponibile' : 'Non disponibile'}
                      </span>
                    </div>
                  </div>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">€{product.price.toFixed(2)}</span>
                    <div className="product-actions">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setCurrentView('productForm');
                        }}
                        className="btn"
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="btn btn-danger"
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Product Form */}
          {currentView === 'productForm' && (
            <form id="productForm" onSubmit={handleSaveProduct}>
              <h3 style={{ marginBottom: '2rem', color: 'var(--text-color)' }}>
                {editingProduct ? 'Modifica Prodotto' : 'Aggiungi Prodotto'}
              </h3>
              <div className="form-group">
                <label htmlFor="category">Categoria</label>
                <select
                  name="category"
                  id="category"
                  className="form-control"
                  required
                  defaultValue={editingProduct?.category_id || (categories[0]?.id || '')}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.emoji} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="name">Nome</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  required
                  defaultValue={editingProduct?.name || ''}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Descrizione</label>
                <textarea
                  name="description"
                  id="description"
                  className="form-control"
                  rows={3}
                  required
                  defaultValue={editingProduct?.description || ''}
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Prezzo (€)</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  className="form-control"
                  step="0.10"
                  min="0"
                  required
                  defaultValue={editingProduct?.price || ''}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn">
                  Salva
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView('products')}
                  className="btn btn-danger"
                >
                  Annulla
                </button>
              </div>
            </form>
          )}

          {/* Category Management */}
          {currentView === 'categoryManagement' && (
            <div style={{ maxWidth: '500px', background: 'var(--paper-color)', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 15px var(--shadow)' }}>
              <h3 style={{ marginBottom: '2rem', color: 'var(--text-color)' }}>Gestione Categorie</h3>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-color)', marginBottom: '1rem' }}>Categorie esistenti:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {categories.map(cat => (
                    <div key={cat.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--light-bg)',
                      padding: '1rem',
                      borderRadius: '8px',
                      color: 'var(--text-color)'
                    }}>
                      <span style={{ fontWeight: '500' }}>{cat.emoji} {cat.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-color)' }}>ID: {cat.id}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => {
                    setCategoryFormMode('add');
                    setEditingCategory(null);
                    setCurrentView('categoryForm');
                  }}
                  className="btn"
                  style={{ width: '100%' }}
                >
                  <span className="button-emoji">➕</span>
                  <span className="button-text">Aggiungi Categoria</span>
                </button>
                <button
                  onClick={() => {
                    setCategoryFormMode('edit');
                    setEditingCategory(categories[0] || null);
                    setCurrentView('categoryForm');
                  }}
                  className="btn"
                  style={{ width: '100%' }}
                  disabled={categories.length === 0}
                >
                  <span className="button-emoji">✏️</span>
                  <span className="button-text">Modifica Categoria</span>
                </button>
                <button
                  onClick={() => {
                    setCategoryFormMode('delete');
                    setEditingCategory(categories[0] || null);
                    setCurrentView('categoryForm');
                  }}
                  className="btn btn-danger"
                  style={{ width: '100%' }}
                  disabled={categories.length === 0}
                >
                  <span className="button-emoji">🗑️</span>
                  <span className="button-text">Elimina Categoria</span>
                </button>
                <button
                  onClick={() => setCurrentView('products')}
                  className="btn"
                  style={{ width: '100%', background: '#6c757d' }}
                >
                  <span className="button-emoji">⬅️</span>
                  <span className="button-text">Indietro</span>
                </button>
              </div>
            </div>
          )}

          {/* Category Form */}
          {currentView === 'categoryForm' && (
            <form id="productForm" onSubmit={handleSaveCategory}>
              <h3 style={{ marginBottom: '2rem', color: 'var(--text-color)' }}>
                {categoryFormMode === 'add' ? 'Aggiungi Categoria' :
                  categoryFormMode === 'edit' ? 'Modifica Categoria' : 'Elimina Categoria'}
              </h3>
              {(categoryFormMode === 'edit' || categoryFormMode === 'delete') && (
                <div className="form-group">
                  <label htmlFor="categoryToEdit">Seleziona Categoria</label>
                  <select
                    id="categoryToEdit"
                    className="form-control"
                    onChange={(e) => {
                      const cat = categories.find(c => c.id === e.target.value);
                      setEditingCategory(cat || null);
                    }}
                    defaultValue={editingCategory?.id || ''}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="categoryId">ID Categoria</label>
                <input
                  type="text"
                  name="categoryId"
                  id="categoryId"
                  className="form-control"
                  required
                  disabled={categoryFormMode === 'delete'}
                  defaultValue={editingCategory?.id || ''}
                  pattern="[a-z0-9-]+"
                  title="Solo lettere minuscole, numeri e trattini"
                />
              </div>

              <div className="form-group">
                <label htmlFor="categoryName">Nome Categoria</label>
                <input
                  type="text"
                  name="categoryName"
                  id="categoryName"
                  className="form-control"
                  required
                  disabled={categoryFormMode === 'delete'}
                  defaultValue={editingCategory?.name || ''}
                />
              </div>

              <div className="form-group">
                <label htmlFor="categoryEmoji">Emoji</label>
                <input
                  type="text"
                  name="categoryEmoji"
                  id="categoryEmoji"
                  className="form-control"
                  required
                  disabled={categoryFormMode === 'delete'}
                  defaultValue={editingCategory?.emoji || ''}
                  maxLength={2}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={categoryFormMode === 'delete' ? 'btn btn-danger' : 'btn'}
                >
                  {isLoading ? 'Caricamento...' : (
                    categoryFormMode === 'add' ? 'Aggiungi' :
                      categoryFormMode === 'edit' ? 'Modifica' : 'Elimina'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView('categoryManagement')}
                  className="btn"
                  style={{ background: '#6c757d' }}
                >
                  Annulla
                </button>
              </div>
            </form>
          )}

          {/* QR Code Panel */}
          {currentView === 'qrCode' && (
            <div style={{
              background: 'var(--paper-color)',
              padding: '3rem',
              borderRadius: '12px',
              boxShadow: '0 2px 15px var(--shadow)',
              textAlign: 'center',
              maxWidth: '600px'
            }}>
              <h3 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>QR Code Menu</h3>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                <div style={{
                  width: '320px',
                  height: '320px',
                  border: '2px solid var(--accent-color)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px var(--shadow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Image
                    src="/img/QRMenu.png"
                    alt="QR Code Menu BiblioCafè"
                    width={280}
                    height={280}
                    style={{ borderRadius: '8px' }}
                    onError={() => {
                      // Fallback se l'immagine non esiste
                    }}
                  />
                </div>
              </div>
              <p style={{ color: 'var(--accent-color)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                <strong>URL:</strong> Menu Digitale BiblioCafè
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={printQRCode}
                  className="btn"
                >
                  <span className="button-emoji">🖨️</span>
                  <span className="button-text">Stampa QR Code</span>
                </button>
                <button
                  onClick={() => setCurrentView('products')}
                  className="btn btn-danger"
                >
                  <span className="button-emoji">⬅️</span>
                  <span className="button-text">Indietro</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
