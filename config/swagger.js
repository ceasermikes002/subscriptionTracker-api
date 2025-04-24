import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Subscription Tracker API',
      version: '1.0.0',
      description: 'API documentation for the Subscription Tracker application',
      contact: {
        name: 'API Support',
        url: 'https://your-domain.com/support',
        email: 'support@your-domain.com'
      },
    },
    servers: [
      {
        url: 'http://localhost:5500',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [
    './routes/*.js',
    './controllers/*.js',
    './models/*.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;