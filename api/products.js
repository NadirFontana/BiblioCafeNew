// ==========================================
// PRODUCTS API - VERCEL EDGE FUNCTION
// ==========================================

// Storage in-memory (in produzione useresti un database)
let products = [];
let nextProductId = 1;

export default async function handler(request, response) {
    // CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    try {
        switch (request.method) {
            case 'GET':
                return handleGetProducts(request, response);
            case 'POST':
                return handleAddProduct(request, response);
            case 'PUT':
                return handleUpdateProduct(request, response);
            case 'DELETE':
                return handleDeleteProduct(request, response);
            default:
                return response.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Products API Error:', error);
        return response.status(500).json({ error: 'Internal server error' });
    }
}

async function handleGetProducts(request, response) {
    const { query } = request;
    
    // Filter by category if requested
    if (query.category) {
        const filteredProducts = products.filter(product => 
            product.category === decodeURIComponent(query.category)
        );
        return response.status(200).json({
            products: filteredProducts,
            count: filteredProducts.length
        });
    }

    // Get single product by ID
    const productId = query.id || request.url.split('/').pop();
    if (productId && productId !== 'products') {
        const product = products.find(p => p.id === parseInt(productId));
        if (!product) {
            return response.status(404).json({ error: 'Product not found' });
        }
        return response.status(200).json({ product });
    }

    // Get all products
    return response.status(200).json({
        products: products,
        count: products.length
    });
}

async function handleAddProduct(request, response) {
    const { category, name, description, price } = request.body;

    // Validation
    if (!category || !name || !description || price == null) {
        return response.status(400).json({ 
            error: 'Missing required fields: category, name, description, price' 
        });
    }

    if (typeof price !== 'number' || price < 0) {
        return response.status(400).json({ 
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

    return response.status(201).json({
        message: 'Product added successfully',
        product: newProduct
    });
}

async function handleUpdateProduct(request, response) {
    const { query } = request;
    const productId = parseInt(query.id || request.url.split('/').pop());

    if (!productId) {
        return response.status(400).json({ error: 'Product ID is required' });
    }

    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return response.status(404).json({ error: 'Product not found' });
    }

    const { category, name, description, price } = request.body;

    // Validation
    if (!category || !name || !description || price == null) {
        return response.status(400).json({ 
            error: 'Missing required fields: category, name, description, price' 
        });
    }

    if (typeof price !== 'number' || price < 0) {
        return response.status(400).json({ 
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

    return response.status(200).json({
        message: 'Product updated successfully',
        product: products[productIndex]
    });
}

async function handleDeleteProduct(request, response) {
    const { query } = request;
    const productId = parseInt(query.id || request.url.split('/').pop());

    if (!productId) {
        return response.status(400).json({ error: 'Product ID is required' });
    }

    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        return response.status(404).json({ error: 'Product not found' });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    return response.status(200).json({
        message: 'Product deleted successfully',
        product: deletedProduct
    });
}