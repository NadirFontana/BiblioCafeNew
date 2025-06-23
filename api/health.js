// ==========================================
// HEALTH CHECK - VERCEL EDGE FUNCTION
// ==========================================

export default async function handler(request, response) {
    // CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    return response.status(200).json({
        message: 'BiblioCafè API is running!',
        timestamp: new Date().toISOString(),
        status: 'healthy'
    });
}