// db (banco de dados)
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'clinica.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Erro ao conectar ao banco:', err);
  else console.log('Conectado ao SQLite');
});

// Criar tabelas 
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      tipo TEXT CHECK(tipo IN ('paciente', 'aluno', 'coordenador')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS pacientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER UNIQUE NOT NULL,
      telefone TEXT,
      data_nascimento TEXT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS alunos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER UNIQUE NOT NULL,
      matricula TEXT,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS consultas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      paciente_id INTEGER NOT NULL,
      aluno_id INTEGER NOT NULL,
      data TEXT NOT NULL,
      horario TEXT NOT NULL,
      status TEXT DEFAULT 'agendada',
      FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
      FOREIGN KEY (aluno_id) REFERENCES alunos(id)
    )
  `);

  db.run(`
  CREATE TRIGGER IF NOT EXISTS after_usuario_insert_paciente
  AFTER INSERT ON usuarios
  WHEN NEW.tipo = 'paciente'
  BEGIN
    INSERT INTO pacientes (usuario_id) VALUES (NEW.id);
  END;
`);

db.run(`
  CREATE TRIGGER IF NOT EXISTS after_usuario_insert_aluno
  AFTER INSERT ON usuarios
  WHEN NEW.tipo = 'aluno'
  BEGIN
    INSERT INTO alunos (usuario_id) VALUES (NEW.id);
  END;
`);
  // Outras tabelas: fichas de atendimento, horários, etc.
});

module.exports = db;