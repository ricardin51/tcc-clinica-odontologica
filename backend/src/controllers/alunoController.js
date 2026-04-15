//alunoController
const db = require('../database/db');

// Listar todos os alunos (apenas coordenador)
exports.listarAlunos = (req, res) => {
  if (req.userTipo !== 'coordenador') {
    return res.status(403).json({ erro: 'Acesso negado' });
  }

  const query = `
    SELECT a.id, u.id as usuario_id, u.nome, u.email, a.matricula
    FROM alunos a
    JOIN usuarios u ON a.usuario_id = u.id
    ORDER BY u.nome
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
};