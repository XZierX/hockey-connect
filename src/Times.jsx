import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import Menu from './Menu';


function Times() {
  const [form, setForm] = useState({
    nome: '',
    cidade: '',
    contato: '',
    descricao: '',
  });

  const [times, setTimes] = useState([]);

  useEffect(() => {
    carregarTimes();
  }, []);

  async function carregarTimes() {
    try {
      const querySnapshot = await getDocs(collection(db, 'times'));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setTimes(lista);
    } catch (error) {
      console.error('Erro ao carregar times:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'times'), form);
      alert('Time cadastrado com sucesso!');
      setForm({
        nome: '',
        cidade: '',
        contato: '',
        descricao: '',
      });
      await carregarTimes();
    } catch (error) {
      console.error('Erro ao salvar time:', error);
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
      <h1>Cadastro de Times</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Time:</label><br />
          <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
        </div>
        <div>
          <label>Cidade:</label><br />
          <input type="text" name="cidade" value={form.cidade} onChange={handleChange} required />
        </div>
        <div>
          <label>Contato:</label><br />
          <input type="text" name="contato" value={form.contato} onChange={handleChange} />
        </div>
        <div>
          <label>Descrição:</label><br />
          <textarea name="descricao" value={form.descricao} onChange={handleChange} />
        </div>
        <button type="submit">Cadastrar Time</button>
      </form>

      <hr />

      <h2>Times Cadastrados</h2>
      {times.length === 0 && <p>Nenhum time cadastrado ainda.</p>}
      {times.map((time) => (
        <div key={time.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <strong>{time.nome}</strong><br />
          Cidade: {time.cidade}<br />
          Contato: {time.contato || 'Não informado'}<br />
          {time.descricao && <>Descrição: {time.descricao}</>}
        </div>
      ))}
    </div>
  );
}

export default Times;
