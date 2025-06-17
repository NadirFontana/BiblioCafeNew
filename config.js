// ==========================================
// CONFIGURAZIONE SUPABASE
// ==========================================

// IMPORTANTE: Sostituisci questi valori con i tuoi dati Supabase
const SUPABASE_CONFIG = {
    // URL del tuo progetto Supabase (lo trovi nel dashboard)
    // Formato: https://[project-id].supabase.co
    url: 'https://xvdgykomgxaawlycevwy.supabase.co',
    
    // Anon key del tuo progetto Supabase (lo trovi in Settings > API)
    // È sicuro esporre questa chiave nel frontend
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjc4ODg2NDAwLCJleHAiOjE5OTQ0NjI0MDB9.your-actual-key-here',
    
    // Configurazioni opzionali
    options: {
        auth: {
            autoRefreshToken: true,
            persistSession: false, // Non salvare la sessione nel localStorage
            detectSessionInUrl: false // Non rilevare sessioni dall'URL
        }
    }
};

// Esporta la configurazione
if (typeof window !== 'undefined') {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}

// Per Node.js (se necessario in futuro)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
}