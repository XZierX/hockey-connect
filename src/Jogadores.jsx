import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import Menu from './Menu';


function Jogadores() {
  const [form, setForm] = useState({
    nome: '',
    posicao: '',
    nivel: '',
    contato: '',
  });

  const [jogadores, setJogadores] = useState([]);

  useEffect(() => {
    carregarJogadores();
  }, []);

  async function carregarJogadores() {
    try {
      const querySnapshot = await getDocs(collection(db, 'jogadores'));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setJogadores(lista);
    } catch (error) {
      console.error('Erro ao carregar jogadores:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'jogadores'), form);
      alert('Jogador cadastrado com sucesso!');
      setForm({
        nome: '',
        posicao: '',
        nivel: '',
        contato: '',
      });
      await carregarJogadores();
    } catch (error) {
      console.error('Erro ao salvar jogador:', error);
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
      <h1>Cadastro de Jogadores</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome:</label><br />
          <input type="text" name="nome" value={form.nome} onChange={handleChange} required />
        </div>
        <div>
          <label>Posição:</label><br />
          <input type="text" name="posicao" value={form.posicao} onChange={handleChange} />
        </div>
        <div>
          <label>Nível:</label><br />
          <select name="nivel" value={form.nivel} onChange={handleChange} required>
            <option value="">Selecione</option>
            <option value="iniciante">Iniciante</option>
            <option value="intermediário">Intermediário</option>
            <option value="avançado">Avançado</option>
          </select>
        </div>
        <div>
          <label>Contato:</label><br />
          <input type="text" name="contato" value={form.contato} onChange={handleChange} />
        </div>
        <button type="submit">Cadastrar Jogador</button>
      </form>

      <hr />

      <h2>Jogadores Cadastrados</h2>
      {jogadores.length === 0 && <p>Nenhum jogador cadastrado ainda.</p>}
      {jogadores.map((jogador) => (
        <div key={jogador.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <strong>{jogador.nome}</strong><br />
          Posição: {jogador.posicao || 'N/A'}<br />
          Nível: {jogador.nivel}<br />
          Contato: {jogador.contato || 'Não informado'}
        </div>
      ))}
    </div>
  );
}

export default Jogadores;
