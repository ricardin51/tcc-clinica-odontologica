//PainelAluno
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function PainelAluno() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const carregarConsultas = async () => {
    try {
      const response = await api.get('/consultas');
      setConsultas(response.data);
    } catch (error) {
      alert('Erro ao carregar consultas');
    } finally {
      setLoading(false);
    }
  };

  const cancelarConsulta = async (id) => {
    if (!window.confirm('Cancelar esta consulta?')) return;
    try {
      await api.delete(`/consultas/${id}`);
      alert('Consulta cancelada');
      carregarConsultas();
    } catch (error) {
      alert('Erro ao cancelar consulta');
    }
  };

  useEffect(() => {
    carregarConsultas();
  }, []);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>;

  return (
    <div className="container-fluid p-4">
      <nav className="navbar navbar-dark bg-dark mb-4 rounded">
        <div className="container-fluid">
          <span className="navbar-brand h1">🦷 Clínica Odontológica - Aluno (Dentista)</span>
          <button className="btn btn-outline-light" onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <div className="card shadow-sm">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">📋 Minhas Consultas</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Data</th><th>Horário</th><th>Paciente</th><th>Status</th><th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {consultas.length === 0 ? (
                  <tr><td colSpan="5" className="text-center">Nenhuma consulta agendada</td></tr>
                ) : (
                  consultas.map(consulta => (
                    <tr key={consulta.id}>
                      <td>{consulta.data}</td><td>{consulta.horario}</td>
                      <td>{consulta.paciente_nome}</td>
                      <td><span className={`badge ${consulta.status === 'agendada' ? 'bg-success' : 'bg-danger'}`}>{consulta.status}</span></td>
                      <td>
                        {consulta.status === 'agendada' && (
                          <button className="btn btn-sm btn-danger" onClick={() => cancelarConsulta(consulta.id)}>Cancelar</button>
                        )}
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

export default PainelAluno;