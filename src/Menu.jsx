import { Link } from 'react-router-dom';

function Menu() {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#eee', marginBottom: '20px' }}>
      <Link to="/" style={{ marginRight: '10px' }}>🏒 Convites</Link>
      <Link to="/torneios" style={{ marginRight: '10px' }}>📅 Torneios</Link>
      <Link to="/times" style={{ marginRight: '10px' }}>🛡️ Times</Link>
      <Link to="/jogadores">👤 Jogadores</Link>
    </nav>
  );
}

export default Menu;
