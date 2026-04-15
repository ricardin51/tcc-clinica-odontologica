const db = require('../database/db');

// Listar consultas conforme o perfil do usuário
exports.listarConsultas = (req, res) => {
  const userId = req.userId;
  const userTipo = req.userTipo;

  let query = '';
  let params = [];

  if (userTipo === 'paciente') {
    // Buscar paciente_id a partir do usuario_id
    query = `
      SELECT c.*, u.nome as paciente_nome, a2.nome as aluno_nome
      FROM consultas c
      JOIN pacientes p ON c.paciente_id = p.id
      JOIN usuarios u ON p.usuario_id = u.id
      JOIN alunos a ON c.aluno_id = a.id
      JOIN usuarios a2 ON a.usuario_id = a2.id
      WHERE p.usuario_id = ?
    `;
    params = [userId];
  } else if (userTipo === 'aluno') {
    query = `
      SELECT c.*, u.nome as paciente_nome, a2.nome as aluno_nome
      FROM consultas c
      JOIN pacientes p ON c.paciente_id = p.id
      JOIN usuarios u ON p.usuario_id = u.id
      JOIN alunos a ON c.aluno_id = a.id
      JOIN usuarios a2 ON a.usuario_id = a2.id
      WHERE a.usuario_id = ?
    `;
    params = [userId];
  } else if (userTipo === 'coordenador') {
    query = `
      SELECT c.*, u.nome as paciente_nome, a2.nome as aluno_nome
      FROM consultas c
      JOIN pacientes p ON c.paciente_id = p.id
      JOIN usuarios u ON p.usuario_id = u.id
      JOIN alunos a ON c.aluno_id = a.id
      JOIN usuarios a2 ON a.usuario_id = a2.id
    `;
    params = [];
  } else {
    return res.status(403).json({ erro: 'Perfil inválido' });
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
};

// Agendar nova consulta
exports.agendarConsulta = (req, res) => {
  const { paciente_id, aluno_id, data, horario } = req.body;

  if (!paciente_id || !aluno_id || !data || !horario) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  // Verificar se o paciente existe e se o aluno existe 
  db.get('SELECT * FROM pacientes WHERE id = ?', [paciente_id], (err, paciente) => {
    if (err || !paciente) {
      return res.status(400).json({ erro: 'Paciente não encontrado' });
    }
    db.get('SELECT * FROM alunos WHERE id = ?', [aluno_id], (err, aluno) => {
      if (err || !aluno) {
        return res.status(400).json({ erro: 'Aluno não encontrado' });
      }

      // Verificar conflito de horário 
      const checkQuery = `
        SELECT * FROM consultas 
        WHERE data = ? AND horario = ? AND (aluno_id = ? OR paciente_id = ?)
      `;
      db.get(checkQuery, [data, horario, aluno_id, paciente_id], (err, existing) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (existing) {
          return res.status(400).json({ erro: 'Horário já ocupado' });
        }

        db.run(
          'INSERT INTO consultas (paciente_id, aluno_id, data, horario, status) VALUES (?, ?, ?, ?, ?)',
          [paciente_id, aluno_id, data, horario, 'agendada'],
          function(err) {
            if (err) return res.status(500).json({ erro: err.message });
            res.status(201).json({ id: this.lastID, paciente_id, aluno_id, data, horario, status: 'agendada' });
          }
        );
      });
    });
  });
};

// Atualizar consulta (apenas status ou reagendamento)
exports.atualizarConsulta = (req, res) => {
  const { id } = req.params;
  const { data, horario, status } = req.body;

  let updates = [];
  let params = [];

  if (data) {
    updates.push('data = ?');
    params.push(data);
  }
  if (horario) {
    updates.push('horario = ?');
    params.push(horario);
  }
  if (status) {
    updates.push('status = ?');
    params.push(status);
  }

  if (updates.length === 0) {
    return res.status(400).json({ erro: 'Nenhum campo para atualizar' });
  }

  params.push(id);
  const query = `UPDATE consultas SET ${updates.join(', ')} WHERE id = ?`;

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    if (this.changes === 0) return res.status(404).json({ erro: 'Consulta não encontrada' });
    res.json({ mensagem: 'Consulta atualizada com sucesso' });
  });
};

// Cancelar consulta
exports.cancelarConsulta = (req, res) => {
  const { id } = req.params;
  db.run('UPDATE consultas SET status = ? WHERE id = ?', ['cancelada', id], function(err) {
    if (err) return res.status(500).json({ erro: err.message });
    if (this.changes === 0) return res.status(404).json({ erro: 'Consulta não encontrada' });
    res.json({ mensagem: 'Consulta cancelada com sucesso' });
  });
};