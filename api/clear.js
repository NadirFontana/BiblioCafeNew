// ==========================================
// CLEAR DATABASE - VERCEL EDGE FUNCTION
// ==========================================

export default async function handler(request, response) {
    // CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // In un ambiente reale, qui puliresti il database
        // Per ora simula la pulizia
        console.log('🧹 Clearing database...');
        
        return response.status(200).json({
            message: 'Database cleared successfully',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Clear Error:', error);
        return response.status(500).json({ 
            error: 'Failed to clear database',
            details: error.message 
        });
    }
}