// backend/src/app.js
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas (serão criadas nos próximos passos)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/consultas', require('./routes/consultaRoutes'));
// ...

module.exports = app;