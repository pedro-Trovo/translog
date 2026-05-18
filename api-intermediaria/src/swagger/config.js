const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TransLog - API de Entregas',
      version: '1.0.0',
      description: 'API intermediaria que traduz chamadas REST para o servidor SOAP legado da TransLog',
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 3001}`, description: 'Desenvolvimento' },
    ],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
