//pacienteController
const db = require('../database/db');

// Listar todos os pacientes (apenas coordenador)
exports.listarPacientes = (req, res) => {
  // Verifica permissão
  if (req.userTipo !== 'coordenador') {
    return res.status(403).json({ erro: 'Acesso negado' });
  }

  const query = `
    SELECT p.id, u.id as usuario_id, u.nome, u.email, p.telefone, p.data_nascimento
    FROM pacientes p
    JOIN usuarios u ON p.usuario_id = u.id
    ORDER BY u.nome
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
};