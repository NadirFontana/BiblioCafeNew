// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { categoriesApi, productsApi, type Category, type Product } from '../lib/api';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // Carica categorie
      const categoriesData = await categoriesApi.getAll();
      setCategories(categoriesData);
      
      // Imposta la prima categoria come attiva
      if (categoriesData.length > 0 && !activeCategory) {
        setActiveCategory(categoriesData[0].id);
      }
      
      // Carica tutti i prodotti
      const productsData = await productsApi.getAll();
      setProducts(productsData);
      
    } catch (err) {
      console.error('Errore nel caricamento dei dati:', err);
      setError('Errore nel caricamento del menu. Riprova più tardi.');
    } finally {
      setIsLoading(false);
    }
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(product => product.category_id === categoryId && product.available);
  };

  const getCurrentCategory = () => {
    return categories.find(cat => cat.id === activeCategory) || categories[0];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-slate-600">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Caricamento menu...</h2>
          <p className="text-sm text-slate-500">Connessione al database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center text-slate-600">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold mb-2 text-red-600">Errore</h2>
          <p className="text-sm text-slate-500 mb-4">{error}</p>
          <button 
            onClick={loadData}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="relative bg-gradient-radial from-emerald-600 to-emerald-800 text-white py-12 px-4 text-center overflow-hidden shadow-xl">
        {/* Colonne decorative */}
        <div className="absolute -left-16 top-0 bottom-0 w-32 opacity-10">
          <Image
            src="/img/pillar.png"
            alt=""
            fill
            className="object-cover object-center brightness-0 invert"
            style={{ clipPath: 'inset(0 0 0 50%)' }}
          />
        </div>
        <div className="absolute -right-16 top-0 bottom-0 w-32 opacity-10">
          <Image
            src="/img/pillar.png"
            alt=""
            fill
            className="object-cover object-center brightness-0 invert"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
        </div>
        
        {/* Logo */}
        <div className="relative z-10 animate-fade-in-scale">
          <Image
            src="/img/logo.png"
            alt="BiblioCafè Logo"
            width={400}
            height={200}
            className="max-w-full w-96 h-auto mx-auto"
            priority
          />
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white p-2 shadow-lg">
        <div className="flex justify-center flex-wrap gap-1 max-w-6xl mx-auto px-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-3 py-2 rounded-full font-semibold text-sm transition-all duration-300 border whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-emerald-600 text-white border-emerald-700 transform -translate-y-0.5'
                  : 'bg-emerald-800 text-white border-emerald-700 hover:transform hover:-translate-y-0.5'
              }`}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-6xl mx-auto w-full">
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-emerald-100 animate-fade-scale">
          {/* Category Title */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold text-emerald-800 pb-4 relative">
              {getCurrentCategory().name}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-emerald-600 rounded-full"></div>
            </h2>
          </div>

          {/* Products Grid */}
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {getProductsByCategory(activeCategory).map((product) => (
              <div
                key={product.id}
                className="bg-white p-7 rounded-xl shadow-sm border border-emerald-50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-md relative overflow-hidden group"
              >
                {/* Top border gradient on hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-800 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="flex flex-col h-full">
                  <div className="font-semibold text-lg text-emerald-800 mb-4 pr-8 leading-relaxed">
                    {product.name}
                  </div>
                  
                  <div className="text-slate-600 text-sm leading-relaxed mb-5 flex-grow opacity-85">
                    {product.description}
                  </div>
                  
                  <div className="text-emerald-600 font-semibold text-lg text-right pt-3 border-t border-slate-100">
                    €{product.price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-emerald-800 text-white p-6 text-center text-sm">
        <p>© 2024 BiblioCafè - Tutti i diritti riservati</p>
      </footer>

      <style jsx>{`
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fade-scale {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in-scale {
          animation: fade-in-scale 1s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-scale {
          animation: fade-scale 0.4s ease-out forwards;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at bottom center, #059669, #065f46);
        }
      `}</style>
    </div>
  );
}