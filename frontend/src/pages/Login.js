import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, senha });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userTipo', response.data.user.tipo);
      localStorage.setItem('userId', response.data.user.id);
      
      const tipo = response.data.user.tipo;
      if (tipo === 'paciente') navigate('/paciente');
      else if (tipo === 'aluno') navigate('/aluno');
      else if (tipo === 'coordenador') navigate('/coordenador');
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro no login';
      alert(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>
  );
}

export default Login;