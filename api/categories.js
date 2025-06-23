let categories = [];

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        switch (req.method) {
            case 'GET':
                return handleGetCategories(req, res);
            case 'POST':
                return handleAddCategory(req, res);
            case 'DELETE':
                return handleDeleteCategory(req, res);
            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Categories API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function handleGetCategories(req, res) {
    return res.status(200).json({
        categories: categories,
        count: categories.length
    });
}

async function handleAddCategory(req, res) {
    const { id, name, emoji } = req.body;

    if (!id || !name || !emoji) {
        return res.status(400).json({ 
            error: 'Missing required fields: id, name, emoji' 
        });
    }

    const existingCategory = categories.find(cat => cat.id === id);
    if (existingCategory) {
        existingCategory.name = name;
        existingCategory.emoji = emoji;
        
        return res.status(200).json({
            message: 'Category updated successfully',
            category: existingCategory
        });
    }

    const newCategory = { id, name, emoji };
    categories.push(newCategory);

    return res.status(201).json({
        message: 'Category added successfully',
        category: newCategory
    });
}

async function handleDeleteCategory(req, res) {
    const { query } = req;
    const categoryId = query.id;

    if (!categoryId) {
        return res.status(400).json({ error: 'Category ID is required' });
    }

    const categoryIndex = categories.findIndex(cat => cat.id === decodeURIComponent(categoryId));
    
    if (categoryIndex === -1) {
        return res.status(404).json({ error: 'Category not found' });
    }

    const deletedCategory = categories.splice(categoryIndex, 1)[0];

    return res.status(200).json({
        message: 'Category deleted successfully',
        category: deletedCategory
    });
}
