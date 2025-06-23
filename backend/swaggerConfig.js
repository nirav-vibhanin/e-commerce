const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'E-Commerce API',
    version: '1.0.0',
    description: 'API documentation for the E-Commerce platform. Provides endpoints for authentication, products, cart, orders, and user management.',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '60c72b2f9b1d8c001f8e4cde' },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john.doe@example.com' },
          role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
        },
      },
      Product: {
        type: 'object',
        required: ['name', 'description', 'price', 'category', 'stock', 'images'],
        properties: {
          id: { 
            type: 'string', 
            example: '60c72b2f9b1d8c001f8e4cde',
            description: 'Auto-generated MongoDB ObjectId'
          },
          name: { 
            type: 'string', 
            example: 'High-Performance Laptop',
            minLength: 2,
            maxLength: 100,
            description: 'Product name (2-100 characters)'
          },
          description: { 
            type: 'string', 
            example: 'High-performance laptop with the latest specifications, perfect for work and gaming. Features include fast processor, ample storage, and excellent graphics capabilities.',
            minLength: 10,
            maxLength: 1000,
            description: 'Product description (10-1000 characters)'
          },
          price: { 
            type: 'number', 
            example: 1200,
            minimum: 0,
            description: 'Product price (must be positive)'
          },
          originalPrice: { 
            type: 'number', 
            example: 1400,
            minimum: 0,
            description: 'Original price before discount'
          },
          category: { 
            type: 'string', 
            example: 'Electronics',
            enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Other'],
            description: 'Product category'
          },
          images: { 
            type: 'array',
            items: { type: 'string' },
            minItems: 1,
            example: [],
            description: 'Array of image URLs (at least one required)'
          },
          stock: { 
            type: 'integer', 
            example: 50,
            minimum: 0,
            description: 'Available stock quantity'
          },
          sku: { 
            type: 'string', 
            example: 'LAP-001',
            description: 'Stock Keeping Unit (unique identifier)'
          },
          brand: { 
            type: 'string', 
            example: 'Dell',
            description: 'Product brand'
          },
          weight: { 
            type: 'number', 
            example: 2.5,
            minimum: 0,
            description: 'Product weight in kg'
          },
          dimensions: {
            type: 'object',
            properties: {
              length: { type: 'number', example: 35.5 },
              width: { type: 'number', example: 24.0 },
              height: { type: 'number', example: 2.0 }
            },
            description: 'Product dimensions in cm'
          },
          tags: { 
            type: 'array',
            items: { type: 'string' },
            example: ['laptop', 'gaming', 'workstation'],
            description: 'Product tags for search'
          },
          rating: { 
            type: 'number', 
            example: 4.5,
            minimum: 0,
            maximum: 5,
            description: 'Average product rating (0-5)'
          },
          numReviews: { 
            type: 'integer', 
            example: 25,
            description: 'Number of reviews'
          },
          isActive: { 
            type: 'boolean', 
            example: true,
            description: 'Whether the product is active'
          },
          featured: { 
            type: 'boolean', 
            example: true,
            description: 'Whether the product is featured'
          },
          discount: { 
            type: 'number', 
            example: 15,
            minimum: 0,
            maximum: 100,
            description: 'Discount percentage (0-100)'
          },
          createdBy: { 
            type: 'string', 
            example: '60c72b2f9b1d8c001f8e4cde',
            description: 'User ID who created the product'
          },
          createdAt: { 
            type: 'string', 
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z',
            description: 'Creation timestamp'
          },
          updatedAt: { 
            type: 'string', 
            format: 'date-time',
            example: '2024-01-15T10:30:00.000Z',
            description: 'Last update timestamp'
          }
        }
      },
      ProductCreate: {
        type: 'object',
        required: ['name', 'description', 'price', 'category', 'stock', 'images'],
        properties: {
          name: { 
            type: 'string', 
            example: 'High-Performance Laptop',
            minLength: 2,
            maxLength: 100,
            description: 'Product name (2-100 characters)'
          },
          description: { 
            type: 'string', 
            example: 'High-performance laptop with the latest specifications, perfect for work and gaming. Features include fast processor, ample storage, and excellent graphics capabilities.',
            minLength: 10,
            maxLength: 1000,
            description: 'Product description (10-1000 characters)'
          },
          price: { 
            type: 'number', 
            example: 1200,
            minimum: 0,
            description: 'Product price (must be positive)'
          },
          originalPrice: { 
            type: 'number', 
            example: 1400,
            minimum: 0,
            description: 'Original price before discount'
          },
          category: { 
            type: 'string', 
            example: 'Electronics',
            enum: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Other'],
            description: 'Product category'
          },
          images: { 
            type: 'array',
            items: { type: 'string' },
            minItems: 1,
            example: [],
            description: 'Array of image URLs (at least one required)'
          },
          stock: { 
            type: 'integer', 
            example: 50,
            minimum: 0,
            description: 'Available stock quantity'
          },
          sku: { 
            type: 'string', 
            example: 'LAP-001',
            description: 'Stock Keeping Unit (unique identifier)'
          },
          brand: { 
            type: 'string', 
            example: 'Dell',
            description: 'Product brand'
          },
          weight: { 
            type: 'number', 
            example: 2.5,
            minimum: 0,
            description: 'Product weight in kg'
          },
          dimensions: {
            type: 'object',
            properties: {
              length: { type: 'number', example: 35.5 },
              width: { type: 'number', example: 24.0 },
              height: { type: 'number', example: 2.0 }
            },
            description: 'Product dimensions in cm'
          },
          tags: { 
            type: 'array',
            items: { type: 'string' },
            example: ['laptop', 'gaming', 'workstation'],
            description: 'Product tags for search'
          },
          discount: { 
            type: 'number', 
            example: 15,
            minimum: 0,
            maximum: 100,
            description: 'Discount percentage (0-100)'
          },
          featured: { 
            type: 'boolean', 
            example: true,
            description: 'Whether the product is featured'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', example: 'field' },
                value: { type: 'string', example: '' },
                msg: { type: 'string', example: 'Description must be between 10 and 1000 characters' },
                path: { type: 'string', example: 'description' },
                location: { type: 'string', example: 'body' }
              }
            }
          }
        }
      }
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec; 