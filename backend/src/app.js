// app.js
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/consultas', require('./routes/consultaRoutes'));
app.use('/api/pacientes', require('./routes/pacienteRoutes'));
app.use('/api/alunos', require('./routes/alunoRoutes'));
// ...

module.exports = app;