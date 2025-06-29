import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

function CadastroTorneios() {
  const [form, setForm] = useState({
    nome: '',
    local: '',
    dataInicio: '',
    dataFim: '',
  });

  const [torneios, setTorneios] = useState([]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'torneios'), form);
      alert('Torneio cadastrado com sucesso!');
      setForm({ nome: '', local: '', dataInicio: '', dataFim: '' });
      carregarTorneios(); // recarrega a lista depois de cadastrar
    } catch (error) {
      console.error('Erro ao salvar torneio:', error);
      alert('Erro ao salvar torneio.');
    }
  }

  async function carregarTorneios() {
    const querySnapshot = await getDocs(collection(db, 'torneios'));
    const lista = [];
    querySnapshot.forEach((doc) => {
      lista.push({ id: doc.id, ...doc.data() });
    });
    setTorneios(lista);
  }

  async function excluirTorneio(id) {
    const confirmacao = window.confirm('Tem certeza que deseja excluir este torneio?');
    if (!confirmacao) return;

    try {
      await deleteDoc(doc(db, 'torneios', id));
      alert('Torneio excluído com sucesso!');
      carregarTorneios(); // atualiza a lista
    } catch (error) {
      console.error('Erro ao excluir torneio:', error);
      alert('Erro ao excluir torneio.');
    }
  }

  useEffect(() => {
    carregarTorneios();
  }, []);

  function formatarDataBr(dataIso) {
    if (!dataIso) return '';
    const [ano, mes, dia] = dataIso.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  return (
    <div>
      <h2>Cadastrar Novo Torneio</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Torneio:</label><br />
          <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
        </div>
        <div>
          <label>Local:</label><br />
          <input type="text" name="local" value={form.local} onChange={handleChange} required />
        </div>
        <div>
          <label>Data de Início:</label><br />
          <input type="date" name="dataInicio" value={form.dataInicio} onChange={handleChange} required />
        </div>
        <div>
          <label>Data de Fim:</label><br />
          <input type="date" name="dataFim" value={form.dataFim} onChange={handleChange} required />
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>Cadastrar Torneio</button>
      </form>

      <hr style={{ margin: '30px 0' }} />

      <h3>Torneios Cadastrados</h3>
      {torneios.length === 0 ? (
        <p>Nenhum torneio cadastrado ainda.</p>
      ) : (
        torneios.map((t) => (
          <div key={t.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <strong>{t.nome}</strong><br />
            Local: {t.local}<br />
            De {formatarDataBr(t.dataInicio)} até {formatarDataBr(t.dataFim)}<br />
            <button
              onClick={() => excluirTorneio(t.id)}
              style={{
                marginTop: '10px',
                backgroundColor: '#c00',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
              }}
            >
              Excluir
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default CadastroTorneios;