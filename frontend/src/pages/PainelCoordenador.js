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
    localStorage.clear();
    navigate('/login');
  };

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
    <div className="container-fluid p-4">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark mb-4 rounded">
        <div className="container-fluid">
          <span className="navbar-brand h1">🏥 Clínica Odontológica - Coordenador</span>
          <button className="btn btn-outline-light" onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      {/* Card do formulário */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">📅 Agendar Nova Consulta</h5>
        </div>
        <div className="card-body">
          <form onSubmit={agendarConsulta}>
            <div className="row g-3">
              <div className="col-md-4">
                <select className="form-select" value={form.paciente_id} onChange={e => setForm({...form, paciente_id: e.target.value})} required>
                  <option value="">Selecione Paciente</option>
                  {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <select className="form-select" value={form.aluno_id} onChange={e => setForm({...form, aluno_id: e.target.value})} required>
                  <option value="">Selecione Aluno</option>
                  {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <input type="date" className="form-control" value={form.data} onChange={e => setForm({...form, data: e.target.value})} required />
              </div>
              <div className="col-md-2">
                <input type="time" className="form-control" value={form.horario} onChange={e => setForm({...form, horario: e.target.value})} required />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary">Agendar</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Tabela de consultas */}
      <div className="card shadow-sm">
        <div className="card-header bg-secondary text-white">
          <h5 className="mb-0">📋 Todas as Consultas</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Paciente</th>
                  <th>Aluno</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                {consultas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">Nenhuma consulta agendada</td>
                  </tr>
                ) : (
                  consultas.map(c => (
                    <tr key={c.id}>
                      <td>{c.data}</td>
                      <td>{c.horario}</td>
                      <td>{c.paciente_nome}</td>
                      <td>{c.aluno_nome}</td>
                      <td>
                        <span className={`badge ${c.status === 'agendada' ? 'bg-success' : 'bg-danger'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => cancelarConsulta(c.id)}>
                          Cancelar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PainelCoordenador;