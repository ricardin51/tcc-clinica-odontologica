//PainelPaciente
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function PainelPaciente() {
  const [consultas, setConsultas] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const carregarConsultas = async () => {
      try {
        const response = await api.get('/consultas');
        setConsultas(response.data);
      } catch (error) {
        alert('Erro ao carregar consultas');
      }
    };
    carregarConsultas();
  }, []);

  return (
    <div className="container-fluid p-4">
      <nav className="navbar navbar-dark bg-dark mb-4 rounded">
        <div className="container-fluid">
          <span className="navbar-brand h1">🏥 Clínica Odontológica - Paciente</span>
          <button className="btn btn-outline-light" onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">📋 Minhas Consultas</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Data</th><th>Horário</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {consultas.length === 0 ? (
                  <tr><td colSpan="3" className="text-center">Nenhuma consulta agendada</td></tr>
                ) : (
                  consultas.map(consulta => (
                    <tr key={consulta.id}>
                      <td>{consulta.data}</td><td>{consulta.horario}</td>
                      <td><span className={`badge ${consulta.status === 'agendada' ? 'bg-success' : 'bg-danger'}`}>{consulta.status}</span></td>
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

export default PainelPaciente;