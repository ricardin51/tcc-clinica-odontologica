// PainelCoordenador
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function PainelCoordenador() {
  const [consultas, setConsultas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [form, setForm] = useState({ paciente_id: '', aluno_id: '', data: '', horario: '' });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userTipo');
    localStorage.removeItem('userId');
    navigate('/login');
  }

  const carregarDados = async () => {
    try {
      const [consultasRes, pacientesRes, alunosRes] = await Promise.all([
        api.get('/consultas'),
        api.get('/pacientes'),
        api.get('/alunos')
      ]);
      setConsultas(consultasRes.data);
      setPacientes(pacientesRes.data);
      setAlunos(alunosRes.data);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar dados');
    }
  };

  const agendarConsulta = async (e) => {
    e.preventDefault();
    try {
      await api.post('/consultas', form);
      alert('Consulta agendada');
      setForm({ paciente_id: '', aluno_id: '', data: '', horario: '' });
      carregarDados();
    } catch (error) {
      alert('Erro ao agendar');
    }
  };

  const cancelarConsulta = async (id) => {
    if (!window.confirm('Cancelar?')) return;
    try {
      await api.delete(`/consultas/${id}`);
      alert('Cancelada');
      carregarDados();
    } catch (error) {
      alert('Erro');
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleLogout} style={{ float: 'right', margin: '10px' }}>Sair</button>  
      <h2>Painel do Coordenador</h2>

      <h3>Agendar Nova Consulta</h3>
      <form onSubmit={agendarConsulta}>
        <select value={form.paciente_id} onChange={e => setForm({...form, paciente_id: e.target.value})} required>
          <option value="">Selecione Paciente</option>
          {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
        </select>
        <select value={form.aluno_id} onChange={e => setForm({...form, aluno_id: e.target.value})} required>
          <option value="">Selecione Aluno</option>
          {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
        </select>
        <input type="date" value={form.data} onChange={e => setForm({...form, data: e.target.value})} required />
        <input type="time" value={form.horario} onChange={e => setForm({...form, horario: e.target.value})} required />
        <button type="submit">Agendar</button>
      </form>

      <h3>Todas as Consultas</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr><th>Data</th><th>Horário</th><th>Paciente</th><th>Aluno</th><th>Status</th><th>Ação</th></tr>
        </thead>
        <tbody>
          {consultas.map(c => (
            <tr key={c.id}>
              <td>{c.data}</td><td>{c.horario}</td>
              <td>{c.paciente_nome}</td><td>{c.aluno_nome}</td>
              <td>{c.status}</td>
              <td><button onClick={() => cancelarConsulta(c.id)}>Cancelar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PainelCoordenador;