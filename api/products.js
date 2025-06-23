// ==========================================
// PRODUCTS API - VERCEL EDGE FUNCTION
// ==========================================

// Storage in-memory (in produzione useresti un database)
let products = [];
let nextProductId = 1;

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight reqs
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        switch (req.method) {
            case 'GET':
                return handleGetProducts(req, res);
            case 'POST':
                return handleAddProduct(req, res);
            case 'PUT':
                return handleUpdateProduct(req, res);
            case 'DELETE':
                return handleDeleteProduct(req, res);
            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Products API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function handleGetProducts(req, res) {
    const { query } = req;
    
    // Filter by category if reqed
    if (query.category) {
        const filteredProducts = products.filter(product => 
            product.category === decodeURIComponent(query.category)
        );
        return res.status(200).json({
            products: filteredProducts,
            count: filteredProducts.length
        });
    }

    // Get single product by ID
    const productId = query.id || req.url.split('/').pop();
    if (productId && productId !== 'products') {
        const product = products.find(p => p.id === parseInt(productId));
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json({ product });
    }

    // Get all products
    return res.status(200).json({
        products: products,
        count: products.length
    });
}

async function handleAddProduct(req, res) {
    const { category, name, description, price } = req.body;

    // Validation
    if (!category || !name || !description || price == null) {
        return res.status(400).json({ 
            error: 'Missing required fields: category, name, description, price' 
        });
    }

    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ 
            error: 'Price must be a positive number' 
        });
    }

    // Create new product
    const newProduct = {
        id: nextProductId++,
        category,
        name,
        description,
        price: parseFloat(price.toFixed(2))
    };

    products.push(newProduct);

    return res.status(201).json({
        message: 'Product added successfully',
        product: newProduct
    });
}

async function handleUpdateProduct(req, res) {
    const { query } = req;
    const productId = parseInt(query.id || req.url.split('/').pop());

    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const { category, name, description, price } = req.body;

    // Validation
    if (!category || !name || !description || price == null) {
        return res.status(400).json({ 
            error: 'Missing required fields: category, name, description, price' 
        });
    }

    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ 
            error: 'Price must be a positive number' 
        });
    }

    // Update product
    products[productIndex] = {
        ...products[productIndex],
        category,
        name,
        description,
        price: parseFloat(price.toFixed(2))
    };

    return res.status(200).json({
        message: 'Product updated successfully',
        product: products[productIndex]
    });
}

async function handleDeleteProduct(req, res) {
    const { query } = req;
    const productId = parseInt(query.id || req.url.split('/').pop());

    if (!productId) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    return res.status(200).json({
        message: 'Product deleted successfully',
        product: deletedProduct
    });
}