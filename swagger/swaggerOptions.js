export const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mi API con Express y MONGODB",
      version: "1.0.0",
      description: "Documentación de la API para gestionar el gym COREFIT",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js"], // Rutas con documentación JSDoc
};