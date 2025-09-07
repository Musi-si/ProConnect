import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ProConnect API',
      version: '1.0.0',
      description: 'RESTful API with JWT auth and Swagger docs',
    },
    servers: [{ url: 'http://localhost:5000' }],
  },
  apis: ['./routes/*.ts'], // Use .ts for TypeScript routes
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };