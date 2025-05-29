// ==========================================
// DATABASE MANAGER - IndexedDB
// ==========================================

class MenuDatabase {
    constructor() {
        this.dbName = 'BiblioCafeDB';
        this.version = 2;
        this.db = null;
    }

    // Inizializza il database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Crea le tabelle se non esistono
                if (!db.objectStoreNames.contains('categories')) {
                    const categoryStore = db.createObjectStore('categories', { keyPath: 'id' });
                    categoryStore.createIndex('name', 'name', { unique: false });
                }

                if (!db.objectStoreNames.contains('products')) {
                    const productStore = db.createObjectStore('products', { keyPath: 'id' });
                    productStore.createIndex('category', 'category', { unique: false });
                    productStore.createIndex('name', 'name', { unique: false });
                }
            };
        });
    }

    // Popola il database con i dati iniziali
    async seedDatabase() {
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
            { id: 1, category: "colazione", name: "Cappuccino e Cornetto", description: "Cappuccino caldo e cornetto a scelta (vuoto, crema, cioccolato o marmellata)", price: 3 },
            { id: 2, category: "colazione", name: "Brioche Siciliana", description: "Brioche col tuppo farcita con granita a scelta", price: 4 },
            { id: 3, category: "colazione", name: "Cornetto Salato", description: "Cornetto con prosciutto cotto e formaggio", price: 3.8 },
            { id: 4, category: "colazione", name: "Maritozzo", description: "Classico maritozzo con panna montata", price: 3.5 },
            { id: 5, category: "colazione", name: "Toast Classico", description: "Prosciutto cotto e formaggio", price: 3.5 },
            { id: 6, category: "colazione", name: "Pancake Stack", description: "Con sciroppo d'acero, frutti di bosco o Nutella", price: 6.5 },
            { id: 7, category: "colazione", name: "Yogurt e Granola", description: "Yogurt greco con granola, miele e frutta fresca", price: 5 },
            { id: 8, category: "colazione", name: "Uova Strapazzate", description: "Con toast e bacon croccante", price: 7.5 },

            // SNACK
            { id: 9, category: "snack", name: "Focaccia Farcita", description: "Con prosciutto crudo, mozzarella e pomodorini", price: 6.5 },
            { id: 10, category: "snack", name: "Club Sandwich", description: "Pollo, bacon, uovo, lattuga, pomodoro e maionese", price: 8 },
            { id: 11, category: "snack", name: "Tagliere Misto", description: "Selezione di salumi e formaggi con focaccia", price: 12 },

            // CAFFETTERIA
            { id: 12, category: "caffetteria", name: "Espresso", description: "Classico caffè espresso", price: 1.2 },
            { id: 13, category: "caffetteria", name: "Cappuccino", description: "Con latte montato a vapore", price: 1.8 },
            { id: 14, category: "caffetteria", name: "Caffè Americano", description: "Espresso allungato con acqua calda", price: 1.5 },

            // APERITIVI
            { id: 15, category: "aperitivi", name: "Spritz Aperol", description: "Prosecco, Aperol e soda", price: 7 },
            { id: 16, category: "aperitivi", name: "Spritz Campari", description: "Prosecco, Campari e soda", price: 7 },
            { id: 17, category: "aperitivi", name: "Spritz Hugo", description: "Prosecco, sciroppo di sambuco, menta e soda", price: 7 },
            { id: 18, category: "aperitivi", name: "Americano", description: "Campari, Vermouth rosso e soda", price: 7 },
            { id: 19, category: "aperitivi", name: "Crodino", description: "Analcolico amaro", price: 3.5 },
            { id: 20, category: "aperitivi", name: "San Bitter", description: "Analcolico rosso", price: 3.5 },

            // COCKTAILS
            { id: 21, category: "cocktails", name: "Negroni", description: "Gin, Vermouth rosso e Campari", price: 8 },
            { id: 22, category: "cocktails", name: "Negroni Sbagliato", description: "Prosecco, Vermouth rosso e Campari", price: 8 },
            { id: 23, category: "cocktails", name: "Moscow Mule", description: "Vodka, ginger beer e lime", price: 8 },
            { id: 24, category: "cocktails", name: "Gin Tonic", description: "Gin premium a scelta e tonica", price: 8 },
            { id: 25, category: "cocktails", name: "Mojito", description: "Rum bianco, lime, menta, zucchero e soda", price: 8 },
            { id: 26, category: "cocktails", name: "Martini Cocktail", description: "Gin o Vodka e Vermouth dry", price: 8 },
            { id: 27, category: "cocktails", name: "Old Fashioned", description: "Bourbon, zucchero e bitter", price: 9 },
            { id: 28, category: "cocktails", name: "Margarita", description: "Tequila, Triple Sec e lime", price: 8 },

            // SOFT DRINKS
            { id: 29, category: "soft-drinks", name: "Spremuta d'Arancia", description: "Succo d'arancia fresco", price: 4 },
            { id: 30, category: "soft-drinks", name: "Centrifugati", description: "Frutta e verdura fresca a scelta", price: 5 },
            { id: 31, category: "soft-drinks", name: "Bibite in Lattina", description: "Coca Cola, Fanta, Sprite", price: 3 }
        ];

        // Verifica se i dati esistono già
        const existingCategories = await this.getAllCategories();
        if (existingCategories.length === 0) {
            // Popola le categorie
            for (const category of categories) {
                await this.addCategory(category);
            }
        }

        const existingProducts = await this.getAllProducts();
        if (existingProducts.length === 0) {
            // Popola i prodotti
            for (const product of products) {
                await this.addProduct(product);
            }
        }
    }

    // ==========================================
    // OPERAZIONI SULLE CATEGORIE
    // ==========================================

    async getAllCategories() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['categories'], 'readonly');
            const store = transaction.objectStore('categories');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async addCategory(category) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['categories'], 'readwrite');
            const store = transaction.objectStore('categories');
            const request = store.put(category);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteCategory(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['categories'], 'readwrite');
            const store = transaction.objectStore('categories');
            const request = store.delete(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // ==========================================
    // OPERAZIONI SUI PRODOTTI
    // ==========================================

    async getAllProducts() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getProductsByCategory(categoryId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const index = store.index('category');
            const request = index.getAll(categoryId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async addProduct(product) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            const request = store.put(product);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // NUOVO METODO: Aggiorna un prodotto esistente
    async updateProduct(id, updatedData) {
        return new Promise(async (resolve, reject) => {
            try {
                // Prima recupera il prodotto esistente
                const existingProduct = await this.getProduct(id);
                if (!existingProduct) {
                    reject(new Error(`Prodotto con ID ${id} non trovato`));
                    return;
                }

                // Crea il prodotto aggiornato mantenendo l'ID originale
                const updatedProduct = {
                    ...existingProduct,
                    ...updatedData,
                    id: id // Assicurati che l'ID rimanga invariato
                };

                // Salva il prodotto aggiornato
                const transaction = this.db.transaction(['products'], 'readwrite');
                const store = transaction.objectStore('products');
                const request = store.put(updatedProduct);

                request.onsuccess = () => {
                    console.log('Prodotto aggiornato con successo:', updatedProduct);
                    resolve(updatedProduct);
                };
                request.onerror = () => reject(request.error);

            } catch (error) {
                reject(error);
            }
        });
    }

    async getProduct(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteProduct(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            const request = store.delete(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getNextProductId() {
        const products = await this.getAllProducts();
        return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    }

    // ==========================================
    // UTILITY
    // ==========================================

    async clearDatabase() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['categories', 'products'], 'readwrite');

            const clearCategories = transaction.objectStore('categories').clear();
            const clearProducts = transaction.objectStore('products').clear();

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }
}

// Istanza globale del database
const menuDB = new MenuDatabase();
