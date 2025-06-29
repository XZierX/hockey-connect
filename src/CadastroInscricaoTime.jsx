import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

function CadastroInscricaoTime() {
  const [form, setForm] = useState({
    nomeTime: '',
    torneioId: '',
    precisaGoleiro: false,
    precisaJogadorLinha: false,
  });

  const [torneios, setTorneios] = useState([]);

  useEffect(() => {
    async function carregarTorneios() {
      const querySnapshot = await getDocs(collection(db, 'torneios'));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setTorneios(lista);
    }

    carregarTorneios();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'inscricoesTimes'), form);
      alert('Inscrição enviada com sucesso!');
      setForm({
        nomeTime: '',
        torneioId: '',
        precisaGoleiro: false,
        precisaJogadorLinha: false,
      });
    } catch (error) {
      console.error('Erro ao salvar inscrição:', error);
      alert('Erro ao salvar inscrição.');
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Inscrição de Time em Torneio</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Time:</label><br />
          <input type="text" name="nomeTime" value={form.nomeTime} onChange={handleChange} required />
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>Torneio:</label><br />
          <select name="torneioId" value={form.torneioId} onChange={handleChange} required>
            <option value="">Selecione um torneio</option>
            {torneios.map((torneio) => (
              <option key={torneio.id} value={torneio.id}>
                {torneio.nome}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: '10px' }}>
          <label>
            <input type="checkbox" name="precisaGoleiro" checked={form.precisaGoleiro} onChange={handleChange} />
            {' '}Precisa de goleiro
          </label><br />
          <label>
            <input type="checkbox" name="precisaJogadorLinha" checked={form.precisaJogadorLinha} onChange={handleChange} />
            {' '}Precisa de jogador de linha
          </label>
        </div>

        <button style={{ marginTop: '15px' }} type="submit">Enviar Inscrição</button>
      </form>
    </div>
  );
}

export default CadastroInscricaoTime;
