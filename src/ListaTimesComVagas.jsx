import { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

function ListaTimesComVagas() {
  const [inscricoes, setInscricoes] = useState([]);
  const [torneios, setTorneios] = useState([]);

  useEffect(() => {
    async function carregarInscricoes() {
      const querySnapshot = await getDocs(collection(db, 'inscricoesTimes'));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setInscricoes(lista);
    }

    async function carregarTorneios() {
      const querySnapshot = await getDocs(collection(db, 'torneios'));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setTorneios(lista);
    }

    carregarInscricoes();
    carregarTorneios();
  }, []);

  function formatarDataBr(dataIso) {
    if (!dataIso) return '';
    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  function nomeDoTorneio(id) {
    const torneio = torneios.find(t => t.id === id);
    return torneio ? `${torneio.nome} (${formatarDataBr(torneio.dataInicio)} - ${formatarDataBr(torneio.dataFim)})` : 'Torneio não encontrado';
  }

  async function excluirInscricao(id) {
    const confirmar = window.confirm('Deseja realmente excluir este time do torneio?');
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, 'inscricoesTimes', id));
      alert('Inscrição excluída com sucesso!');
      setInscricoes(inscricoes.filter(i => i.id !== id));
    } catch (error) {
      console.error('Erro ao excluir inscrição:', error);
      alert('Erro ao excluir inscrição.');
    }
  }

  return (
    <div style={{ padding: '20px', marginTop: '30px' }}>
      <h2>Times com Vagas</h2>
      {inscricoes.length === 0 ? (
        <p>Nenhum time inscrito em torneios no momento.</p>
      ) : (
        inscricoes.map((i) => (
          <div key={i.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <strong>Time:</strong> {i.nomeTime}<br />
            <strong>Torneio:</strong> {nomeDoTorneio(i.torneioId)}<br />
            <strong>Precisa de:</strong> {i.vaga}<br />
            <button
              onClick={() => excluirInscricao(i.id)}
              style={{
                marginTop: '10px',
                backgroundColor: '#c00',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              Excluir este time do torneio
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ListaTimesComVagas;
