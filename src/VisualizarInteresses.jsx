import { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

function VisualizarInteresses() {
  const [torneios, setTorneios] = useState([]);
  const [inscricoes, setInscricoes] = useState([]);
  const [interesses, setInteresses] = useState([]);

  const [torneioSelecionado, setTorneioSelecionado] = useState('');
  const [timeSelecionado, setTimeSelecionado] = useState('');

  async function carregarInscricoes() {
    const querySnapshot = await getDocs(collection(db, 'inscricoesTimes'));
    const lista = [];
    querySnapshot.forEach((doc) => {
      lista.push({ id: doc.id, ...doc.data() });
    });
    setInscricoes(lista);
  }
  async function excluirInteresse(id) {
    const confirmar = window.confirm('Deseja excluir este interesse?');
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, 'interesses', id));
      alert('Interesse excluído com sucesso!');
      const novaLista = interesses.filter((i) => i.id !== id);
      setInteresses(novaLista);
    } catch (error) {
      console.error('Erro ao excluir interesse:', error);
      alert('Erro ao excluir interesse.');
    }
  }

  useEffect(() => {
    async function carregarTorneios() {
      const querySnapshot = await getDocs(collection(db, 'torneios'));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setTorneios(lista);
    }

    async function carregarInteresses() {
      const querySnapshot = await getDocs(collection(db, 'interesses'));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setInteresses(lista);
    }

    carregarTorneios();
    carregarInscricoes();
    carregarInteresses();
  }, []);

  const timesDoTorneio = inscricoes.filter(i => i.torneioId === torneioSelecionado);
  const interessesDoTime = interesses.filter(i => i.timeId === timeSelecionado);

  return (
    <div style={{ padding: '20px', marginTop: '30px' }}>
      <h2>Interesses Recebidos</h2>

      <div>
        <label>Selecione um torneio:</label><br />
        <select value={torneioSelecionado} onChange={(e) => {
          setTorneioSelecionado(e.target.value);
          setTimeSelecionado('');
        }}>
          <option value="">-- Escolha um torneio --</option>
          {torneios.map((t) => (
            <option key={t.id} value={t.id}>{t.nome}</option>
          ))}
        </select>
      </div>

      {torneioSelecionado && (
        <div style={{ marginTop: '15px' }}>
          <label>Selecione seu time:</label><br />
          <select value={timeSelecionado} onChange={(e) => setTimeSelecionado(e.target.value)}>
            <option value="">-- Escolha um time --</option>
            {timesDoTorneio.map((t) => (
              <option key={t.id} value={t.id}>{t.nomeTime}</option>
            ))}
          </select>
        </div>
      )}

      {timeSelecionado && (
        <div style={{ marginTop: '20px' }}>
          <h3>Interesses recebidos:</h3>
          {interessesDoTime.length === 0 ? (
            <p>Nenhum interesse recebido ainda.</p>
          ) : (
            interessesDoTime.map((i) => (
              <div key={i.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                <strong>Nome:</strong> {i.nomeJogador}<br />
                <strong>Contato:</strong> {i.contato}<br />
                <strong>Posição:</strong> {i.posicao}<br />
                <button
                  onClick={() => excluirInteresse(i.id)}
                  style={{
                    marginTop: '10px',
                    backgroundColor: '#888',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer'
                  }}
                >
                  Excluir Interesse
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default VisualizarInteresses;
