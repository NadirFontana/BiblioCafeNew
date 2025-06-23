// ==========================================
// CATEGORIES API - VERCEL EDGE FUNCTION
// ==========================================

// Storage in-memory (in produzione useresti un database)
let categories = [];

export default async function handler(request, response) {
    // CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    try {
        switch (request.method) {
            case 'GET':
                return handleGetCategories(request, response);
            case 'POST':
                return handleAddCategory(request, response);
            case 'DELETE':
                return handleDeleteCategory(request, response);
            default:
                return response.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Categories API Error:', error);
        return response.status(500).json({ error: 'Internal server error' });
    }
}

async function handleGetCategories(request, response) {
    return response.status(200).json({
        categories: categories,
        count: categories.length
    });
}

async function handleAddCategory(request, response) {
    const { id, name, emoji } = request.body;

    // Validation
    if (!id || !name || !emoji) {
        return response.status(400).json({ 
            error: 'Missing required fields: id, name, emoji' 
        });
    }

    // Check if category already exists
    const existingCategory = categories.find(cat => cat.id === id);
    if (existingCategory) {
        // Update existing category
        existingCategory.name = name;
        existingCategory.emoji = emoji;
        
        return response.status(200).json({
            message: 'Category updated successfully',
            category: existingCategory
        });
    }

    // Add new category
    const newCategory = { id, name, emoji };
    categories.push(newCategory);

    return response.status(201).json({
        message: 'Category added successfully',
        category: newCategory
    });
}

async function handleDeleteCategory(request, response) {
    const { query } = request;
    const categoryId = query.id || request.url.split('/').pop();

    if (!categoryId) {
        return response.status(400).json({ error: 'Category ID is required' });
    }

    const categoryIndex = categories.findIndex(cat => cat.id === decodeURIComponent(categoryId));
    
    if (categoryIndex === -1) {
        return response.status(404).json({ error: 'Category not found' });
    }

    const deletedCategory = categories.splice(categoryIndex, 1)[0];

    return response.status(200).json({
        message: 'Category deleted successfully',
        category: deletedCategory
    });
}