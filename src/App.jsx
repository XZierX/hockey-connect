import { Routes, Route, Link } from 'react-router-dom';
import CadastroInscricaoTime from './CadastroInscricaoTime';
import ListaTimesComVagas from './ListaTimesComVagas';
import VisualizarInteresses from './VisualizarInteresses';
import CadastroTorneios from './CadastroTorneios';


function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🏒 Hockey Connect</h1>

      {/* Navegação simples */}
      <nav style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
  <Link to="/">Início</Link>
  <Link to="/cadastro">Inscrever Time</Link>
  <Link to="/vagas">Ver Vagas</Link>
  <Link to="/interesses">Interesses Recebidos</Link>
  <Link to="/torneios">Cadastrar Torneio</Link>
</nav>

      {/* Rotas */}
      <Routes>
        <Route path="/" element={<p>Bem-vindo ao Hockey Connect!</p>} />
        <Route path="/cadastro" element={<CadastroInscricaoTime />} />
        <Route path="/vagas" element={<ListaTimesComVagas />} />
        <Route path="/interesses" element={<VisualizarInteresses />} />
        <Route path="/torneios" element={<CadastroTorneios />} />
      </Routes>
    </div>
  );
}

export default App;