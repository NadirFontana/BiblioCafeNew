// ==========================================
// SEED DATABASE - VERCEL EDGE FUNCTION
// ==========================================

// Dati di esempio per il BiblioCafè
const SEED_CATEGORIES = [
    { id: 'caffe', name: 'Caffè e Bevande Calde', emoji: '☕' },
    { id: 'bevande-fredde', name: 'Bevande Fredde', emoji: '🥤' },
    { id: 'dolci', name: 'Dolci e Pasticceria', emoji: '🧁' },
    { id: 'salati', name: 'Snack Salati', emoji: '🥪' },
    { id: 'gelati', name: 'Gelati', emoji: '🍦' },
    { id: 'cocktail', name: 'Cocktail', emoji: '🍹' }
];

const SEED_PRODUCTS = [
    // Caffè e Bevande Calde
    { category: 'caffe', name: 'Espresso', description: 'Il nostro caffè signature, tostato artigianalmente', price: 1.20 },
    { category: 'caffe', name: 'Cappuccino', description: 'Espresso con schiuma di latte cremosa', price: 1.80 },
    { category: 'caffe', name: 'Caffè Americano', description: 'Espresso allungato con acqua calda', price: 1.50 },
    { category: 'caffe', name: 'Latte Macchiato', description: 'Latte caldo con un shot di espresso', price: 2.20 },
    { category: 'caffe', name: 'Cioccolata Calda', description: 'Cioccolato fondente con panna montata', price: 2.80 },
    { category: 'caffe', name: 'Tè Verde', description: 'Tè verde biologico selezionato', price: 2.00 },

    // Bevande Fredde
    { category: 'bevande-fredde', name: 'Caffè Freddo', description: 'Espresso ghiacciato dolcificato', price: 2.00 },
    { category: 'bevande-fredde', name: 'Cappuccino Freddo', description: 'Cappuccino servito con ghiaccio', price: 2.50 },
    { category: 'bevande-fredde', name: 'Spremuta d\'Arancia', description: 'Arance fresche spremute al momento', price: 3.50 },
    { category: 'bevande-fredde', name: 'Limonata', description: 'Limoni freschi, acqua e zucchero di canna', price: 2.80 },
    { category: 'bevande-fredde', name: 'Tè Freddo Pesca', description: 'Tè nero aromatizzato alla pesca', price: 2.50 },
    { category: 'bevande-fredde', name: 'Smoothie Frutti Rossi', description: 'Fragole, mirtilli e banana frullati', price: 4.50 },

    // Dolci e Pasticceria
    { category: 'dolci', name: 'Cornetto', description: 'Cornetto artigianale vuoto o con crema', price: 1.80 },
    { category: 'dolci', name: 'Maritozzo', description: 'Dolce romano con panna montata fresca', price: 3.20 },
    { category: 'dolci', name: 'Tiramisù', description: 'Il nostro tiramisù della casa', price: 4.50 },
    { category: 'dolci', name: 'Cannolo Siciliano', description: 'Cannolo con ricotta fresca e gocce di cioccolato', price: 3.80 },
    { category: 'dolci', name: 'Cheesecake ai Frutti di Bosco', description: 'Cheesecake cremosa con coulis di frutti di bosco', price: 5.20 },
    { category: 'dolci', name: 'Biscotti della Casa', description: 'Assortimento di biscotti artigianali (3 pezzi)', price: 2.50 },

    // Snack Salati
    { category: 'salati', name: 'Toast Prosciutto e Formaggio', description: 'Toast con prosciutto cotto e fontina', price: 4.50 },
    { category: 'salati', name: 'Panino Caprese', description: 'Mozzarella, pomodoro, basilico e olio EVO', price: 5.20 },
    { category: 'salati', name: 'Focaccia Rosmarino', description: 'Focaccia calda con rosmarino e sale grosso', price: 2.80 },
    { category: 'salati', name: 'Piadina Crudo e Stracciatella', description: 'Piadina con prosciutto crudo e stracciatella', price: 6.50 },
    { category: 'salati', name: 'Tramezzino Tonno e Carciofini', description: 'Tramezzino fresco con tonno e carciofini', price: 3.80 },

    // Gelati
    { category: 'gelati', name: 'Gelato Artigianale (2 gusti)', description: 'Scegli due gusti tra i nostri disponibili', price: 3.50 },
    { category: 'gelati', name: 'Coppa Gelato (3 gusti)', description: 'Tre gusti a scelta con panna e ciliegia', price: 4.80 },
    { category: 'gelati', name: 'Affogato al Caffè', description: 'Gelato alla vaniglia "affogato" nell\'espresso caldo', price: 4.20 },
    { category: 'gelati', name: 'Granita Siciliana', description: 'Granita tradizionale (limone, caffè o mandorla)', price: 3.20 },

    // Cocktail
    { category: 'cocktail', name: 'Spritz Aperol', description: 'Aperol, Prosecco, soda e arancia', price: 6.50 },
    { category: 'cocktail', name: 'Negroni', description: 'Gin, Campari e Vermouth rosso', price: 8.00 },
    { category: 'cocktail', name: 'Mojito', description: 'Rum bianco, lime, menta e soda', price: 7.50 },
    { category: 'cocktail', name: 'Americano', description: 'Campari, Vermouth rosso e soda', price: 6.00 },
    { category: 'cocktail', name: 'Bellini', description: 'Prosecco e purea di pesca bianca', price: 7.00 }
];

export default async function handler(request, response) {
    // CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // In un ambiente reale, qui faresti le chiamate alle altre API
        // Per ora simula il seeding restituendo i dati di esempio
        
        console.log('🌱 Seeding database with sample data...');
        
        // Simula il seeding
        const seedResult = {
            categories: SEED_CATEGORIES.length,
            products: SEED_PRODUCTS.length,
            timestamp: new Date().toISOString()
        };

        return response.status(200).json({
            message: 'Database seeded successfully',
            seeded: seedResult,
            categories: SEED_CATEGORIES,
            products: SEED_PRODUCTS
        });

    } catch (error) {
        console.error('Seed Error:', error);
        return response.status(500).json({ 
            error: 'Failed to seed database',
            details: error.message 
        });
    }
}

// Esporta i dati per essere utilizzati da altre API
export { SEED_CATEGORIES, SEED_PRODUCTS };