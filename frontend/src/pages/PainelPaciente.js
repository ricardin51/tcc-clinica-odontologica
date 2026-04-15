//PainelPaciente
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function PainelPaciente() {
  const [consultas, setConsultas] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userTipo');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  useEffect(() => {
    const carregarConsultas = async () => {
      try {
        const response = await api.get('/consultas');
        setConsultas(response.data);
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar consultas');
      }
    };
    carregarConsultas();
  }, []);

  return (
    <div>
      <button onClick={handleLogout} style={{ float: 'right', margin: '10px' }}>sair</button>  
      <h2>Painel do Paciente</h2>
      <h3>Minhas Consultas</h3>
      <ul>
        {consultas.map(consulta => (
          <li key={consulta.id}>
            {consulta.data} às {consulta.horario} - Status: {consulta.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PainelPaciente;