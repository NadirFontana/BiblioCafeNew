// ==========================================
// DATABASE MANAGER - SUPABASE
// ==========================================

class MenuDatabase {
    constructor() {
        // Carica la configurazione dal file config.js
        const config = window.SUPABASE_CONFIG || {};
        
        this.SUPABASE_URL = config.url || 'https://xvdgykomgxaawlycevwy.supabase.co';
        this.SUPABASE_ANON_KEY = config.anonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZGd5a29tZ3hhYXdseWNldnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTI5ODQsImV4cCI6MjA2NTcyODk4NH0.SSeQzXMq9AdwsXX-Udr2Juhb3D_0LdE0RPC1-5kvKGYs';
        this.SUPABASE_OPTIONS = config.options || {};
        
        this.supabase = null;
        this.initialized = false;
    }

    // Inizializza la connessione a Supabase
    async init() {
        try {
            // Carica Supabase dalla CDN se non è già caricato
            if (typeof window.supabase === 'undefined') {
                await this.loadSupabaseScript();
            }

            // Inizializza il client Supabase
            this.supabase = window.supabase.createClient(
                this.SUPABASE_URL, 
                this.SUPABASE_ANON_KEY,
                this.SUPABASE_OPTIONS
            );
            
            // Test della connessione
            const { data, error } = await this.supabase.from('categories').select('count').limit(1);
            
            if (error && error.code !== 'PGRST116') { // PGRST116 = tabella vuota, va bene
                throw new Error(`Errore connessione Supabase: ${error.message}`);
            }

            this.initialized = true;
            console.log('✅ Connessione a Supabase stabilita con successo');
            return true;

        } catch (error) {
            console.error('❌ Errore inizializzazione Supabase:', error);
            throw error;
        }
    }

    // Carica dinamicamente lo script di Supabase
    async loadSupabaseScript() {
        return new Promise((resolve, reject) => {
            if (document.querySelector('script[src*="supabase"]')) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/dist/umd/supabase.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Impossibile caricare Supabase'));
            document.head.appendChild(script);
        });
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

        const categories = [
            { id: "colazione", name: "Colazione", emoji: "🥐" },
            { id: "snack", name: "Snack", emoji: "🥪" },
            { id: "caffetteria", name: "Caffetteria", emoji: "☕" },
            { id: "aperitivi", name: "Aperitivi", emoji: "🍹" },
            { id: "cocktails", name: "Cocktails", emoji: "🍸" },
            { id: "soft-drinks", name: "Soft Drinks", emoji: "🥤" }
        ];

        const products = [
            // COLAZIONE
            { category: "colazione", name: "Cappuccino e Cornetto", description: "Cappuccino caldo e cornetto a scelta (vuoto, crema, cioccolato o marmellata)", price: 3.00 },
            { category: "colazione", name: "Brioche Siciliana", description: "Brioche col tuppo farcita con granita a scelta", price: 4.00 },
            { category: "colazione", name: "Cornetto Salato", description: "Cornetto con prosciutto cotto e formaggio", price: 3.80 },
            { category: "colazione", name: "Maritozzo", description: "Classico maritozzo con panna montata", price: 3.50 },
            { category: "colazione", name: "Toast Classico", description: "Prosciutto cotto e formaggio", price: 3.50 },
            { category: "colazione", name: "Pancake Stack", description: "Con sciroppo d'acero, frutti di bosco o Nutella", price: 6.50 },
            { category: "colazione", name: "Yogurt e Granola", description: "Yogurt greco con granola, miele e frutta fresca", price: 5.00 },
            { category: "colazione", name: "Uova Strapazzate", description: "Con toast e bacon croccante", price: 7.50 },
            
            // SNACK
            { category: "snack", name: "Focaccia Farcita", description: "Con prosciutto crudo, mozzarella e pomodorini", price: 6.50 },
            { category: "snack", name: "Club Sandwich", description: "Pollo, bacon, uovo, lattuga, pomodoro e maionese", price: 8.00 },
            { category: "snack", name: "Tagliere Misto", description: "Selezione di salumi e formaggi con focaccia", price: 12.00 },
            
            // CAFFETTERIA
            { category: "caffetteria", name: "Espresso", description: "Classico caffè espresso", price: 1.20 },
            { category: "caffetteria", name: "Cappuccino", description: "Con latte montato a vapore", price: 1.80 },
            { category: "caffetteria", name: "Caffè Americano", description: "Espresso allungato con acqua calda", price: 1.50 },
            
            // APERITIVI
            { category: "aperitivi", name: "Spritz Aperol", description: "Prosecco, Aperol e soda", price: 7.00 },
            { category: "aperitivi", name: "Spritz Campari", description: "Prosecco, Campari e soda", price: 7.00 },
            { category: "aperitivi", name: "Spritz Hugo", description: "Prosecco, sciroppo di sambuco, menta e soda", price: 7.00 },
            { category: "aperitivi", name: "Americano", description: "Campari, Vermouth rosso e soda", price: 7.00 },
            { category: "aperitivi", name: "Crodino", description: "Analcolico amaro", price: 3.50 },
            { category: "aperitivi", name: "San Bitter", description: "Analcolico rosso", price: 3.50 },
            
            // COCKTAILS
            { category: "cocktails", name: "Negroni", description: "Gin, Vermouth rosso e Campari", price: 8.00 },
            { category: "cocktails", name: "Negroni Sbagliato", description: "Prosecco, Vermouth rosso e Campari", price: 8.00 },
            { category: "cocktails", name: "Moscow Mule", description: "Vodka, ginger beer e lime", price: 8.00 },
            { category: "cocktails", name: "Gin Tonic", description: "Gin premium a scelta e tonica", price: 8.00 },
            { category: "cocktails", name: "Mojito", description: "Rum bianco, lime, menta, zucchero e soda", price: 8.00 },
            { category: "cocktails", name: "Martini Cocktail", description: "Gin o Vodka e Vermouth dry", price: 8.00 },
            { category: "cocktails", name: "Old Fashioned", description: "Bourbon, zucchero e bitter", price: 9.00 },
            { category: "cocktails", name: "Margarita", description: "Tequila, Triple Sec e lime", price: 8.00 },
            
            // SOFT DRINKS
            { category: "soft-drinks", name: "Spremuta d'Arancia", description: "Succo d'arancia fresco", price: 4.00 },
            { category: "soft-drinks", name: "Centrifugati", description: "Frutta e verdura fresca a scelta", price: 5.00 },
            { category: "soft-drinks", name: "Bibite in Lattina", description: "Coca Cola, Fanta, Sprite", price: 3.00 }
        ];

        try {
            // Verifica se ci sono già categorie
            const { data: existingCategories, error: categoriesError } = await this.supabase
                .from('categories')
                .select('id')
                .limit(1);

            if (categoriesError) {
                throw categoriesError;
            }

            // Se non ci sono categorie, popola il database
            if (!existingCategories || existingCategories.length === 0) {
                console.log('🌱 Popolamento database con dati iniziali...');

                // Inserisci le categorie
                const { error: categoryInsertError } = await this.supabase
                    .from('categories')
                    .insert(categories);

                if (categoryInsertError) {
                    throw categoryInsertError;
                }

                // Inserisci i prodotti
                const { error: productInsertError } = await this.supabase
                    .from('products')
                    .insert(products);

                if (productInsertError) {
                    throw productInsertError;
                }

                console.log('✅ Database popolato con successo');
            } else {
                console.log('ℹ️ Database già popolato, salto il seeding');
            }

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
            const { data, error } = await this.supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;
            return data || [];

        } catch (error) {
            console.error('Errore nel recupero delle categorie:', error);
            throw error;
        }
    }

    async addCategory(category) {
        this.checkInitialized();
        
        try {
            const { data, error } = await this.supabase
                .from('categories')
                .insert([category])
                .select()
                .single();

            if (error) throw error;
            return data;

        } catch (error) {
            console.error('Errore nell\'aggiunta della categoria:', error);
            throw error;
        }
    }

    async deleteCategory(id) {
        this.checkInitialized();
        
        try {
            const { data, error } = await this.supabase
                .from('categories')
                .delete()
                .eq('id', id)
                .select();

            if (error) throw error;
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
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .order('category')
                .order('name');

            if (error) throw error;
            return data || [];

        } catch (error) {
            console.error('Errore nel recupero dei prodotti:', error);
            throw error;
        }
    }

    async getProductsByCategory(categoryId) {
        this.checkInitialized();
        
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('category', categoryId)
                .order('name');

            if (error) throw error;
            return data || [];

        } catch (error) {
            console.error('Errore nel recupero dei prodotti per categoria:', error);
            throw error;
        }
    }

    async addProduct(product) {
        this.checkInitialized();
        
        try {
            // Rimuovi l'ID se presente, dato che Supabase lo genera automaticamente
            const { id, ...productData } = product;
            
            const { data, error } = await this.supabase
                .from('products')
                .insert([productData])
                .select()
                .single();

            if (error) throw error;
            return data;

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
            
            const { data, error } = await this.supabase
                .from('products')
                .update(dataToUpdate)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;

        } catch (error) {
            console.error('Errore nell\'aggiornamento del prodotto:', error);
            throw error;
        }
    }

    async getProduct(id) {
        this.checkInitialized();
        
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null; // Prodotto non trovato
                }
                throw error;
            }
            
            return data;

        } catch (error) {
            console.error('Errore nel recupero del prodotto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        this.checkInitialized();
        
        try {
            const { data, error } = await this.supabase
                .from('products')
                .delete()
                .eq('id', id)
                .select();

            if (error) throw error;
            return data;

        } catch (error) {
            console.error('Errore nell\'eliminazione del prodotto:', error);
            throw error;
        }
    }

    async getNextProductId() {
        // Con Supabase e SERIAL, non è necessario generare manualmente l'ID
        // Questo metodo è mantenuto per compatibilità ma non utilizzato
        return Date.now(); // Fallback, ma non dovrebbe essere necessario
    }

    // ==========================================
    // UTILITY
    // ==========================================

    async clearDatabase() {
        this.checkInitialized();
        
        try {
            // Elimina prima i prodotti (per rispettare le foreign key)
            const { error: productsError } = await this.supabase
                .from('products')
                .delete()
                .neq('id', 0); // Elimina tutti i record

            if (productsError) throw productsError;

            // Poi elimina le categorie
            const { error: categoriesError } = await this.supabase
                .from('categories')
                .delete()
                .neq('id', ''); // Elimina tutti i record

            if (categoriesError) throw categoriesError;

            console.log('✅ Database pulito con successo');

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
            const [categoriesResult, productsResult] = await Promise.all([
                this.supabase.from('categories').select('id', { count: 'exact' }),
                this.supabase.from('products').select('id', { count: 'exact' })
            ]);

            return {
                categories: categoriesResult.count || 0,
                products: productsResult.count || 0,
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
