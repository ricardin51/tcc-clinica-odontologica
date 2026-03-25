import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PainelPaciente from './pages/PainelPaciente';
import PainelAluno from './pages/PainelAluno';
import PainelCoordenador from './pages/PainelCoordenador';

function App() {
  // Verificar se o usuário está autenticado (exemplo simples)
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/paciente" element={token ? <PainelPaciente /> : <Navigate to="/login" />} />
        <Route path="/aluno" element={token ? <PainelAluno /> : <Navigate to="/login" />} />
        <Route path="/coordenador" element={token ? <PainelCoordenador /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;