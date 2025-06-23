// ==========================================
// DATABASE MANAGER - VERCEL EDGE FUNCTIONS
// ==========================================

class MenuDatabase {
    constructor() {
        // Base URL per le API (sarà automaticamente impostato da Vercel)
        this.API_BASE = '/api';
        this.initialized = false;
    }

    // Inizializza la connessione alle Edge Functions
    async init() {
        try {
            // Test della connessione
            const response = await fetch(`${this.API_BASE}/health`);
            
            if (!response.ok) {
                throw new Error(`API non disponibile: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Connessione alle Edge Functions stabilita:', data.message);
            
            this.initialized = true;
            return true;

        } catch (error) {
            console.error('❌ Errore inizializzazione Edge Functions:', error);
            throw error;
        }
    }

    // Verifica che il database sia inizializzato
    checkInitialized() {
        if (!this.initialized) {
            throw new Error('Database non inizializzato. Chiamare prima init()');
        }
    }

    // Popola il database con i dati iniziali
    async seedDatabase() {
        this.checkInitialized();

        try {
            const response = await fetch(`${this.API_BASE}/seed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Errore seeding: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Database popolato:', result.message);
            return result;

        } catch (error) {
            console.error('❌ Errore durante il seeding del database:', error);
            throw error;
        }
    }

    // ==========================================
    // OPERAZIONI SULLE CATEGORIE
    // ==========================================

    async getAllCategories() {
        this.checkInitialized();
        
        try {
            const response = await fetch(`${this.API_BASE}/categories`);
            
            if (!response.ok) {
                throw new Error(`Errore recupero categorie: ${response.status}`);
            }

            const data = await response.json();
            return data.categories || [];

        } catch (error) {
            console.error('Errore nel recupero delle categorie:', error);
            throw error;
        }
    }

    async addCategory(category) {
        this.checkInitialized();
        
        try {
            const response = await fetch(`${this.API_BASE}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(category)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `Errore aggiunta categoria: ${response.status}`);
            }

            const data = await response.json();
            return data.category;

        } catch (error) {
            console.error('Errore nell\'aggiunta della categoria:', error);
            throw error;
        }
    }

    async deleteCategory(id) {
        this.checkInitialized();
        
        try {
            const response = await fetch(`${this.API_BASE}/categories/${encodeURIComponent(id)}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `Errore eliminazione categoria: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Errore nell\'eliminazione della categoria:', error);
            throw error;
        }
    }

    // ==========================================
    // OPERAZIONI SUI PRODOTTI
    // ==========================================

    async getAllProducts() {
        this.checkInitialized();
        
        try {
            const response = await fetch(`${this.API_BASE}/products`);
            
            if (!response.ok) {
                throw new Error(`Errore recupero prodotti: ${response.status}`);
            }

            const data = await response.json();
            return data.products || [];

        } catch (error) {
            console.error('Errore nel recupero dei prodotti:', error);
            throw error;
        }
    }

    async getProductsByCategory(categoryId) {
        this.checkInitialized();
        
        try {
            const response = await fetch(`${this.API_BASE}/products?category=${encodeURIComponent(categoryId)}`);
            
            if (!response.ok) {
                throw new Error(`Errore recupero prodotti per categoria: ${response.status}`);
            }

            const data = await response.json();
            return data.products || [];

        } catch (error) {
            console.error('Errore nel recupero dei prodotti per categoria:', error);
            throw error;
        }
    }

    async addProduct(product) {
        this.checkInitialized();
        
        try {
            // Rimuovi l'ID se presente, verrà generato dal server
            const { id, ...productData } = product;
            
            const response = await fetch(`${this.API_BASE}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `Errore aggiunta prodotto: ${response.status}`);
            }

            const data = await response.json();
            return data.product;

        } catch (error) {
            console.error('Errore nell\'aggiunta del prodotto:', error);
            throw error;
        }
    }

    async updateProduct(id, updatedData) {
        this.checkInitialized();
        
        try {
            // Rimuovi l'ID dai dati di aggiornamento
            const { id: _, ...dataToUpdate } = updatedData;
            
            const response = await fetch(`${this.API_BASE}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToUpdate)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `Errore aggiornamento prodotto: ${response.status}`);
            }

            const data = await response.json();
            return data.product;

        } catch (error) {
            console.error('Errore nell\'aggiornamento del prodotto:', error);
            throw error;
        }
    }

    async getProduct(id) {
        this.checkInitialized();
        
        try {
            const response = await fetch(`${this.API_BASE}/products/${id}`);

            if (!response.ok) {
                if (response.status === 404) {
                    return null; // Prodotto non trovato
                }
                throw new Error(`Errore recupero prodotto: ${response.status}`);
            }
            
            const data = await response.json();
            return data.product;

        } catch (error) {
            console.error('Errore nel recupero del prodotto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        this.checkInitialized();
        
        try {
            const response = await fetch(`${this.API_BASE}/products/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `Errore eliminazione prodotto: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Errore nell\'eliminazione del prodotto:', error);
            throw error;
        }
    }

    async getNextProductId() {
        // Non necessario con le Edge Functions, l'ID viene generato dal server
        return Date.now();
    }

    // ==========================================
    // UTILITY
    // ==========================================

    async clearDatabase() {
        this.checkInitialized();
        
        try {
            const response = await fetch(`${this.API_BASE}/clear`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error(`Errore pulizia database: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Database pulito:', data.message);
            return data;

        } catch (error) {
            console.error('❌ Errore durante la pulizia del database:', error);
            throw error;
        }
    }

    // ==========================================
    // METODI DI DEBUGGING E MONITORING
    // ==========================================

    async getStats() {
        this.checkInitialized();
        
        try {
            const response = await fetch(`${this.API_BASE}/stats`);
            
            if (!response.ok) {
                throw new Error(`Errore recupero statistiche: ${response.status}`);
            }

            const data = await response.json();
            return {
                categories: data.categories || 0,
                products: data.products || 0,
                connected: true,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('Errore nel recupero delle statistiche:', error);
            return {
                categories: 0,
                products: 0,
                connected: false,
                error: error.message
            };
        }
    }

    // Test di connessione
    async testConnection() {
        try {
            const stats = await this.getStats();
            console.log('📊 Statistiche database:', stats);
            return stats.connected;
        } catch (error) {
            console.error('❌ Test di connessione fallito:', error);
            return false;
        }
    }
}

// Istanza globale del database
const menuDB = new MenuDatabase();

// Debug: esponi il database globalmente per i test
if (typeof window !== 'undefined') {
    window.menuDB = menuDB;
}
