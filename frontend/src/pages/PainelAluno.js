//PainelAluno
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function PainelAluno() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () =>{
    localStorage.removeItem('token');
    localStorage.removeItem('userTipo');
    localStorage.removeItem('userId');
    navigate('/login');
  }

  const carregarConsultas = async () => {
    try {
      const response = await api.get('/consultas');
      setConsultas(response.data);
    } catch (error) {
      console.error(error);
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
      carregarConsultas(); // recarrega a lista
    } catch (error) {
      alert('Erro ao cancelar consulta');
    }
  };

  useEffect(() => {
    carregarConsultas();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={handleLogout} style={{ float: 'right', margin: '10px' }}>Sair</button>
      <h2>Painel do Aluno (Dentista)</h2>
      <h3>Minhas Consultas</h3>
      {consultas.length === 0 && <p>Nenhuma consulta agendada.</p>}
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>Data</th><th>Horário</th><th>Paciente</th><th>Status</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {consultas.map(consulta => (
            <tr key={consulta.id}>
              <td>{consulta.data}</td>
              <td>{consulta.horario}</td>
              <td>{consulta.paciente_nome}</td>
              <td>{consulta.status}</td>
              <td>
                {consulta.status === 'agendada' && (
                  <button onClick={() => cancelarConsulta(consulta.id)}>Cancelar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PainelAluno;