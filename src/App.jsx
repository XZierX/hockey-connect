import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import Menu from './Menu';

function formatarDataBr(dataIso) {
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
}

function App() {
const [form, setForm] = useState({
  nomeTime: '',
  nomeTorneio: '',
  local: '',
  tipo: '',
  inicioTorneio: '',
  fimTorneio: '',
  dataJogo: '',
  amistoso: false,
  ehTorneio: false,
  observacoes: '',
});

  const [times, setTimes] = useState([]);
  const [torneios, setTorneios] = useState([]);
  const [torneioSelecionado, setTorneioSelecionado] = useState(null);


  const [convites, setConvites] = useState([]);
  async function carregarConvites() {
    try {
      const querySnapshot = await getDocs(collection(db, 'convites'));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setConvites(lista);
    } catch (error) {
      console.error('Erro ao carregar convites:', error);
    }
  }
  useEffect(() => {
  carregarConvites();
}, []);
  useEffect(() => {
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

  carregarTimes();
}, []);
  useEffect(() => {
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

  carregarTorneios();
}, []);


  function handleTipoChange(tipoSelecionado) {
    setForm({
      ...form,
      tipo: form.tipo === tipoSelecionado ? '' : tipoSelecionado,
      inicioTorneio: '',
      fimTorneio: '',
      dataJogo: '',
      amistoso: false,
      ehTorneio: false,
    });
  }

  function handleChange(e) {
    if (e.target.name === 'nomeTorneio') {
  const torneio = torneios.find(t => t.nome === e.target.value);
  console.log('Torneio selecionado:', torneio);
  setTorneioSelecionado(torneio || null);
    }
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    });
  }

async function handleSubmit(e) {
  e.preventDefault();

  try {
    // ✅ Preenche automaticamente as datas se houver torneio selecionado
    if (torneioSelecionado) {
      form.inicioTorneio = torneioSelecionado.dataInicio;
      form.fimTorneio = torneioSelecionado.dataFim;

    }

    const docRef = await addDoc(collection(db, 'convites'), form);
    alert('Convite publicado com sucesso!');
    console.log('Convite salvo com ID:', docRef.id);

    await carregarConvites();

    setForm({
      nomeTime: '',
      nomeTorneio: '',
      local: '',
      tipo: '',
      inicioTorneio: '',
      fimTorneio: '',
      dataJogo: '',
      amistoso: false,
      ehTorneio: false,
      observacoes: '',
    });

    setTorneioSelecionado(null); // ✅ reseta o torneio selecionado
  } catch (error) {
    console.error('Erro ao salvar convite:', error);
    alert('Erro ao publicar convite. Veja o console para detalhes.');
  }
}



  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <Menu />
      <h1>Hockey Connect</h1>
      <h2>Postar convite</h2>
      <form onSubmit={handleSubmit}>
       <div>
  <label>Time:</label><br />
  <select name="nomeTime" value={form.nomeTime} onChange={handleChange} required>
    <option value="">Selecione um time</option>
    {times.map((time) => (
      <option key={time.id} value={time.nome}>
        {time.nome}
      </option>
    ))}
  </select>
</div>

        <div>
          <label>Local:</label><br />
          <input type="text" name="local" value={form.local} onChange={handleChange} required />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={form.tipo === 'torneio'}
              onChange={() => handleTipoChange('torneio')}
            />
            {' '}Torneio
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input
              type="checkbox"
              checked={form.tipo === 'jogo'}
              onChange={() => handleTipoChange('jogo')}
            />
            {' '}Jogo individual
          </label>
        </div>
{form.tipo === 'torneio' && (
  <>
    <div style={{ marginTop: '10px' }}>
      <label>Torneio:</label><br />
      <select
        name="nomeTorneio"
        value={form.nomeTorneio}
        onChange={handleChange}
        required
      >
        <option value="">Selecione um torneio</option>
        {torneios.map((torneio) => (
          <option key={torneio.id} value={torneio.nome}>
            {torneio.nome}
          </option>
        ))}
      </select>
    </div>

    {torneioSelecionado ? (
      <div style={{ marginTop: '10px' }}>
        <p><strong>Início:</strong> {formatarDataBr(torneioSelecionado.dataInicio)}</p>
        <p><strong>Fim:</strong> {formatarDataBr(torneioSelecionado.dataFim)}</p>

      </div>
    ) : (
      <>
        <div>
          <label>Início do Torneio:</label><br />
          <input
            type="date"
            name="inicioTorneio"
            value={form.inicioTorneio}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Fim do Torneio:</label><br />
          <input
            type="date"
            name="fimTorneio"
            value={form.fimTorneio}
            onChange={handleChange}
          />
        </div>
      </>
    )}
  </>
)}

        {form.tipo === 'jogo' && (
          <>
            <div>
              <label>Data do Jogo:</label><br />
              <input type="date" name="dataJogo" value={form.dataJogo} onChange={handleChange} required />
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="amistoso"
                  checked={form.amistoso}
                  onChange={handleChange}
                />
                {' '}Este é um amistoso
              </label>
            </div>
          </>
        )}

        <div>
          <label>Observações:</label><br />
          <textarea name="observacoes" value={form.observacoes} onChange={handleChange} />
        </div>

        <button type="submit">Publicar Convite</button>
      </form>

      <hr />

      <h2>Convites publicados</h2>
      {convites.length === 0 && <p>Nenhum convite publicado ainda.</p>}
      {convites.map((convite, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <strong>Time:</strong> {convite.nomeTime}<br />
          <strong>Local:</strong> {convite.local}<br />
          {convite.tipo === 'torneio' && (
            <>
              <strong>Torneio:</strong> de {convite.inicioTorneio} até {convite.fimTorneio}<br />
            </>
          )}
          {convite.tipo === 'jogo' && (
            <>
              <strong>Jogo:</strong> em {convite.dataJogo} ({convite.amistoso ? 'Amistoso' : 'Oficial'})<br />
            </>
          )}
          {convite.observacoes && (
            <>
              <strong>Observações:</strong> {convite.observacoes}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;