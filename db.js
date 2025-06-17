import { createClient } from '@supabase/supabase-js'
// ==========================================
// DATABASE MANAGER - SUPABASE CLOUD
// ==========================================

class MenuDatabase {
    constructor() {
        // Configurazione Supabase
        this.supabaseUrl = 'https://xvdgykomgxaawlycevwy.supabase.co';
        // Carica la chiave dall'ambiente o dalla window se non disponibile
        this.supabaseKey = typeof process !== 'undefined' && process.env
            ? process.env.SUPABASE_KEY
            : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZGd5a29tZ3hhYXdseWNldnd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTI5ODQsImV4cCI6MjA2NTcyODk4NH0.SSeQzXMq9AdwsXX-Udr2Juhb3D_0LdE0RPC1-5kvKGY';

        this.supabase = null;
        this.initialized = false;
    }

    // Inizializza il database cloud
    async init() {
        try {
            // Se siamo in un browser, carica Supabase dinamicamente
            if (typeof window !== 'undefined' && typeof createClient === 'undefined') {
                await this.loadSupabase();
            }

            // Inizializza client Supabase
            this.supabase = createClient(this.supabaseUrl, this.supabaseKey);

            // Testa la connessione
            const { data, error } = await this.supabase.from('categories').select('count');
            if (error && error.code === '42P01') {
                // Tabelle non esistono, mostra istruzioni
                await this.createTables();
            }

            this.initialized = true;
            console.log('Database cloud inizializzato con successo');
            return true;
        } catch (error) {
            console.error('Errore inizializzazione database cloud:', error);
            throw error;
        }
    }

    // Carica la libreria Supabase dinamicamente per browser
    async loadSupabase() {
        return new Promise((resolve, reject) => {
            if (typeof window === 'undefined') {
                resolve(); // Node.js environment
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = () => {
                // Assicurati che la libreria sia disponibile globalmente
                window.supabase = window.supabase || {};
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Crea le tabelle nel database (da eseguire solo una volta)
    async createTables() {
        console.log('Le tabelle devono essere create nel pannello Supabase Dashboard');
        console.log('SQL per categories:');
        console.log(`
            CREATE TABLE categories (
                id VARCHAR PRIMARY KEY,
                name VARCHAR NOT NULL,
                emoji VARCHAR(2)
            );
        `);
        console.log('SQL per products:');
        console.log(`
            CREATE TABLE products (
                id SERIAL PRIMARY KEY,
                category VARCHAR REFERENCES categories(id) ON DELETE CASCADE,
                name VARCHAR NOT NULL,
                description TEXT,
                price DECIMAL(8,2) NOT NULL
            );
        `);
    }

    // Popola il database con i dati iniziali
    async seedDatabase() {
        try {
            // Verifica se i dati esistono già
            const { data: existingCategories } = await this.supabase
                .from('categories')
                .select('*');

            if (existingCategories && existingCategories.length === 0) {
                const categories = [
                    { id: "colazione", name: "Colazione", emoji: "🥐" },
                    { id: "snack", name: "Snack", emoji: "🥪" },
                    { id: "caffetteria", name: "Caffetteria", emoji: "☕" },
                    { id: "aperitivi", name: "Aperitivi", emoji: "🍹" },
                    { id: "cocktails", name: "Cocktails", emoji: "🍸" },
                    { id: "soft-drinks", name: "Soft Drinks", emoji: "🥤" }
                ];

                const { error: categoriesError } = await this.supabase
                    .from('categories')
                    .insert(categories);

                if (categoriesError) throw categoriesError;

                const products = [
                    // COLAZIONE
                    { category: "colazione", name: "Cappuccino e Cornetto", description: "Cappuccino caldo e cornetto a scelta (vuoto, crema, cioccolato o marmellata)", price: 3 },
                    { category: "colazione", name: "Brioche Siciliana", description: "Brioche col tuppo farcita con granita a scelta", price: 4 },
                    { category: "colazione", name: "Cornetto Salato", description: "Cornetto con prosciutto cotto e formaggio", price: 3.8 },
                    { category: "colazione", name: "Maritozzo", description: "Classico maritozzo con panna montata", price: 3.5 },
                    { category: "colazione", name: "Toast Classico", description: "Prosciutto cotto e formaggio", price: 3.5 },
                    { category: "colazione", name: "Pancake Stack", description: "Con sciroppo d'acero, frutti di bosco o Nutella", price: 6.5 },
                    { category: "colazione", name: "Yogurt e Granola", description: "Yogurt greco con granola, miele e frutta fresca", price: 5 },
                    { category: "colazione", name: "Uova Strapazzate", description: "Con toast e bacon croccante", price: 7.5 },

                    // SNACK
                    { category: "snack", name: "Focaccia Farcita", description: "Con prosciutto crudo, mozzarella e pomodorini", price: 6.5 },
                    { category: "snack", name: "Club Sandwich", description: "Pollo, bacon, uovo, lattuga, pomodoro e maionese", price: 8 },
                    { category: "snack", name: "Tagliere Misto", description: "Selezione di salumi e formaggi con focaccia", price: 12 },

                    // CAFFETTERIA
                    { category: "caffetteria", name: "Espresso", description: "Classico caffè espresso", price: 1.2 },
                    { category: "caffetteria", name: "Cappuccino", description: "Con latte montato a vapore", price: 1.8 },
                    { category: "caffetteria", name: "Caffè Americano", description: "Espresso allungato con acqua calda", price: 1.5 },

                    // APERITIVI
                    { category: "aperitivi", name: "Spritz Aperol", description: "Prosecco, Aperol e soda", price: 7 },
                    { category: "aperitivi", name: "Spritz Campari", description: "Prosecco, Campari e soda", price: 7 },
                    { category: "aperitivi", name: "Spritz Hugo", description: "Prosecco, sciroppo di sambuco, menta e soda", price: 7 },
                    { category: "aperitivi", name: "Americano", description: "Campari, Vermouth rosso e soda", price: 7 },
                    { category: "aperitivi", name: "Crodino", description: "Analcolico amaro", price: 3.5 },
                    { category: "aperitivi", name: "San Bitter", description: "Analcolico rosso", price: 3.5 },

                    // COCKTAILS
                    { category: "cocktails", name: "Negroni", description: "Gin, Vermouth rosso e Campari", price: 8 },
                    { category: "cocktails", name: "Negroni Sbagliato", description: "Prosecco, Vermouth rosso e Campari", price: 8 },
                    { category: "cocktails", name: "Moscow Mule", description: "Vodka, ginger beer e lime", price: 8 },
                    { category: "cocktails", name: "Gin Tonic", description: "Gin premium a scelta e tonica", price: 8 },
                    { category: "cocktails", name: "Mojito", description: "Rum bianco, lime, menta, zucchero e soda", price: 8 },
                    { category: "cocktails", name: "Martini Cocktail", description: "Gin o Vodka e Vermouth dry", price: 8 },
                    { category: "cocktails", name: "Old Fashioned", description: "Bourbon, zucchero e bitter", price: 9 },
                    { category: "cocktails", name: "Margarita", description: "Tequila, Triple Sec e lime", price: 8 },

                    // SOFT DRINKS
                    { category: "soft-drinks", name: "Spremuta d'Arancia", description: "Succo d'arancia fresco", price: 4 },
                    { category: "soft-drinks", name: "Centrifugati", description: "Frutta e verdura fresca a scelta", price: 5 },
                    { category: "soft-drinks", name: "Bibite in Lattina", description: "Coca Cola, Fanta, Sprite", price: 3 }
                ];

                const { error: productsError } = await this.supabase
                    .from('products')
                    .insert(products);

                if (productsError) throw productsError;

                console.log('Database popolato con dati iniziali');
            }
        } catch (error) {
            console.error('Errore nel popolamento database:', error);
            throw error;
        }
    }

    // ==========================================
    // OPERAZIONI SULLE CATEGORIE
    // ==========================================

    async getAllCategories() {
        try {
            const { data, error } = await this.supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Errore caricamento categorie:', error);
            throw error;
        }
    }

    async addCategory(category) {
        try {
            const { data, error } = await this.supabase
                .from('categories')
                .insert([category])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Errore aggiunta categoria:', error);
            throw error;
        }
    }

    async deleteCategory(id) {
        try {
            const { error } = await this.supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Errore eliminazione categoria:', error);
            throw error;
        }
    }

    // ==========================================
    // OPERAZIONI SUI PRODOTTI
    // ==========================================

    async getAllProducts() {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .order('name');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Errore caricamento prodotti:', error);
            throw error;
        }
    }

    async getProductsByCategory(categoryId) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('category', categoryId)
                .order('name');

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Errore caricamento prodotti per categoria:', error);
            throw error;
        }
    }

    async addProduct(product) {
        try {
            // Rimuovi l'ID se presente (sarà auto-generato)
            const { id, ...productData } = product;

            const { data, error } = await this.supabase
                .from('products')
                .insert([productData])
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Errore aggiunta prodotto:', error);
            throw error;
        }
    }

    async updateProduct(id, updatedData) {
        try {
            // Rimuovi l'ID dai dati di aggiornamento
            const { id: _, ...dataToUpdate } = updatedData;

            const { data, error } = await this.supabase
                .from('products')
                .update(dataToUpdate)
                .eq('id', id)
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Errore aggiornamento prodotto:', error);
            throw error;
        }
    }

    async getProduct(id) {
        try {
            const { data, error } = await this.supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Errore caricamento prodotto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const { error } = await this.supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Errore eliminazione prodotto:', error);
            throw error;
        }
    }

    async getNextProductId() {
        // Non necessario con database cloud (ID auto-incrementale)
        return null;
    }

    // ==========================================
    // UTILITY
    // ==========================================

    async clearDatabase() {
        try {
            // Elimina prima i prodotti (per rispettare le foreign key)
            const { error: productsError } = await this.supabase
                .from('products')
                .delete()
                .neq('id', 0); // Elimina tutti

            if (productsError) throw productsError;

            // Poi elimina le categorie
            const { error: categoriesError } = await this.supabase
                .from('categories')
                .delete()
                .neq('id', ''); // Elimina tutti

            if (categoriesError) throw categoriesError;

            return true;
        } catch (error) {
            console.error('Errore pulizia database:', error);
            throw error;
        }
    }

    // ==========================================
    // FUNZIONI DI SINCRONIZZAZIONE REAL-TIME
    // ==========================================

    // Ascolta i cambiamenti in tempo reale
    subscribeToChanges(callback) {
        if (!this.supabase) {
            console.warn('Supabase client non inizializzato');
            return null;
        }

        try {
            // Crea un canale unico per questa sessione
            const channelName = `menu-changes-${Date.now()}`;

            const subscription = this.supabase
                .channel(channelName)
                .on('postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'categories'
                    },
                    (payload) => {
                        console.log('Categoria cambiata:', payload);
                        if (callback) callback('categories', payload);
                    }
                )
                .on('postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'products'
                    },
                    (payload) => {
                        console.log('Prodotto cambiato:', payload);
                        if (callback) callback('products', payload);
                    }
                )
                .subscribe((status) => {
                    if (status === 'SUBSCRIBED') {
                        console.log('Sincronizzazione real-time attivata');
                    } else if (status === 'CHANNEL_ERROR') {
                        console.error('Errore nel canale real-time');
                    } else if (status === 'TIMED_OUT') {
                        console.warn('Timeout connessione real-time');
                    }
                });

            return subscription;
        } catch (error) {
            console.error('Errore nella creazione della subscription:', error);
            return null;
        }
    }

    // Interrompi l'ascolto dei cambiamenti
    unsubscribeFromChanges(subscription) {
        if (subscription && this.supabase) {
            try {
                this.supabase.removeChannel(subscription);
                console.log('Subscription rimossa');
            } catch (error) {
                console.error('Errore nella rimozione della subscription:', error);
            }
        }
    }

    // Funzione di test per verificare la connessione real-time
    async testRealtimeConnection() {
        try {
            const testCallback = (table, payload) => {
                console.log('Test real-time funzionante:', table, payload);
            };

            const subscription = this.subscribeToChanges(testCallback);

            // Aspetta un momento per stabilire la connessione
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Fai un piccolo cambiamento per testare
            const testCategory = {
                id: 'test-realtime',
                name: 'Test Real-time',
                emoji: '🧪'
            };

            await this.addCategory(testCategory);

            // Aspetta per vedere se il callback viene chiamato
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Pulisci il test
            await this.deleteCategory('test-realtime');
            this.unsubscribeFromChanges(subscription);

            return true;
        } catch (error) {
            console.error('Test real-time fallito:', error);
            return false;
        }
    }
}

// Esporta la classe e crea un'istanza globale
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MenuDatabase;
} else {
    // Browser environment
    window.MenuDatabase = MenuDatabase;
}

// Istanza globale del database
const menuDB = new MenuDatabase();

// Esporta anche l'istanza
if (typeof module !== 'undefined' && module.exports) {
    module.exports.menuDB = menuDB;
} else {
    window.menuDB = menuDB;
}
