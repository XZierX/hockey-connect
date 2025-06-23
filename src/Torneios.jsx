import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import Menu from './Menu';


function Torneios() {
  const [form, setForm] = useState({
    nome: '',
    local: '',
    dataInicio: '',
    dataFim: '',
    observacoes: '',
  });

  const [torneios, setTorneios] = useState([]);

  useEffect(() => {
    carregarTorneios();
  }, []);

  async function carregarTorneios() {
    try {
      const querySnapshot = await getDocs(collection(db, 'torneios'));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setTorneios(lista);
    } catch (error) {
      console.error('Erro ao carregar torneios:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'torneios'), form);
      alert('Torneio cadastrado com sucesso!');
      setForm({
        nome: '',
        local: '',
        dataInicio: '',
        dataFim: '',
        observacoes: '',
      });
      await carregarTorneios();
    } catch (error) {
      console.error('Erro ao salvar torneio:', error);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <Menu />
      <h1>Cadastro de Torneios</h1>
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
        <div>
          <label>Observações:</label><br />
          <textarea name="observacoes" value={form.observacoes} onChange={handleChange} />
        </div>
        <button type="submit">Cadastrar Torneio</button>
      </form>

      <hr />

      <h2>Torneios Cadastrados</h2>
      {torneios.length === 0 && <p>Nenhum torneio cadastrado ainda.</p>}
      {torneios.map((torneio) => (
        <div key={torneio.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <strong>{torneio.nome}</strong><br />
          Local: {torneio.local}<br />
          De {torneio.dataInicio} até {torneio.dataFim}<br />
          {torneio.observacoes && <>Obs: {torneio.observacoes}</>}
        </div>
      ))}
    </div>
  );
}

export default Torneios;
