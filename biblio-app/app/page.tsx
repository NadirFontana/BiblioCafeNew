'use client';

import './index.css';
import { useState, useEffect } from 'react';
import { categoriesApi, productsApi, Category, Product } from '../lib/api';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Carica categorie e prodotti all'avvio
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          categoriesApi.getAll(),
          productsApi.getAll()
        ]);
        
        // Ordina le categorie per order_index
        const sortedCategories = categoriesData.sort((a, b) => a.order_index - b.order_index);
        setCategories(sortedCategories);
        setProducts(productsData);
        
        // Imposta la prima categoria come attiva
        if (sortedCategories.length > 0) {
          setActiveCategory(sortedCategories[0].id);
        }
      } catch (err) {
        setError('Errore nel caricamento del menu');
        console.error('Errore:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtra i prodotti per la categoria attiva
  const getProductsByCategory = (categoryId: string) => {
    return products
      .filter(product => product.category_id === categoryId && product.available)
      .sort((a, b) => a.order_index - b.order_index);
  };

  // Gestisce il cambio di categoria
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <h2>Caricamento menu...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          <h2>Errore nel caricamento del menu</h2>
          <p>Si prega di ricaricare la pagina</p>
        </div>
      </div>
    );
  }

  const activeCategoryData = categories.find(cat => cat.id === activeCategory);
  const categoryProducts = getProductsByCategory(activeCategory);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <header>
        <img 
          src="/img/pillar.png" 
          alt="" 
          className="column-left"
        />
        <img 
          src="/img/pillar.png" 
          alt="" 
          className="column-right"
        />
        
        <img
          src="/img/logo.png"
          alt="BiblioCafè Logo"
          className="header-logo"
        />
      </header>

      {/* Navigation */}
      <nav>
        <div className="nav-container">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`nav-button ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {activeCategoryData && (
          <div className="category active">
            <h2 className="category-title">
              {activeCategoryData.emoji} {activeCategoryData.name}
            </h2>
            <div className="menu-grid">
              {categoryProducts.length > 0 ? (
                categoryProducts.map((product) => (
                  <div key={product.id} className="item">
                    <div className="item-name">{product.name}</div>
                    <div className="item-description">{product.description}</div>
                    <div className="item-price">€{product.price.toFixed(2)}</div>
                  </div>
                ))
              ) : (
                <div style={{ 
                  gridColumn: '1 / -1', 
                  textAlign: 'center', 
                  padding: '2rem',
                  color: '#666'
                }}>
                  Nessun prodotto disponibile in questa categoria
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer>
        <p>© 2024 BiblioCafè - Tutti i diritti riservati</p>
      </footer>
    </div>
  );
}
