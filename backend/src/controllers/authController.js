const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

exports.register = (req, res) => {
  const { nome, email, senha, tipo } = req.body;
  // Validações e hash da senha
  bcrypt.hash(senha, 10, (err, hash) => {
    if (err) return res.status(500).json({ erro: 'Erro ao criar senha' });
    db.run(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
      [nome, email, hash, tipo],
      function(err) {
        if (err) return res.status(400).json({ erro: 'Email já cadastrado' });
        res.status(201).json({ id: this.lastID, nome, email, tipo });
      }
    );
  });
};

exports.login = (req, res) => {
  const { email, senha } = req.body;
  db.get('SELECT * FROM usuarios WHERE email = ?', [email], (err, user) => {
    if (!user) return res.status(400).json({ erro: 'Usuário não encontrado' });
    bcrypt.compare(senha, user.senha, (err, valid) => {
      if (!valid) return res.status(400).json({ erro: 'Senha inválida' });
      const token = jwt.sign({ id: user.id, tipo: user.tipo }, 'segredo', { expiresIn: '1d' });
      res.json({ token, user: { id: user.id, nome: user.nome, email: user.email, tipo: user.tipo } });
    });
  });
};