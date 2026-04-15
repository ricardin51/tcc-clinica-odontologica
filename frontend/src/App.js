// App.js
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PainelPaciente from './pages/PainelPaciente';
import PainelAluno from './pages/PainelAluno';
import PainelCoordenador from './pages/PainelCoordenador';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/paciente"
          element={
            <PrivateRoute role="paciente">
              <PainelPaciente />
            </PrivateRoute>
          }
        />
        <Route
          path="/aluno"
          element={
            <PrivateRoute role="aluno">
              <PainelAluno />
            </PrivateRoute>
          }
        />
        <Route
          path="/coordenador"
          element={
            <PrivateRoute role="coordenador">
              <PainelCoordenador />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;