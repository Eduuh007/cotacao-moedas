async function carregarCotacoes() {
  try {
    const res = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL');
    const data = await res.json();

    document.getElementById('dolar').textContent = `R$ ${parseFloat(data.USDBRL.bid).toFixed(2)}`;
    document.getElementById('euro').textContent = `R$ ${parseFloat(data.EURBRL.bid).toFixed(2)}`;
    document.getElementById('bitcoin').textContent = `R$ ${parseFloat(data.BTCBRL.bid).toFixed(2)}`;
  } catch (erro) {
    console.error('Erro ao carregar cotações:', erro);
  }
}

async function gerarGrafico(moeda = 'USD-BRL') {
  try {
    const res = await fetch(`https://economia.awesomeapi.com.br/json/daily/${moeda}/7`);
    const dados = await res.json();

    const labels = dados.map(d => {
      const data = new Date(d.timestamp * 1000);
      return data.toLocaleDateString('pt-BR');
    }).reverse();

    const valores = dados.map(d => parseFloat(d.bid)).reverse();

    const ctx = document.getElementById('grafico').getContext('2d');

    if (window.graficoExistente) {
      window.graficoExistente.destroy();
    }

    window.graficoExistente = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `Histórico de ${moeda}`,
          data: valores,
          borderColor: 'green',
          backgroundColor: 'rgba(0, 128, 0, 0.1)',
          fill: true
        }]
      }
    });
  } catch (erro) {
    console.error('Erro ao gerar gráfico:', erro);
  }
}

document.getElementById('moedaSelect').addEventListener('change', e => {
  gerarGrafico(e.target.value);
});

carregarCotacoes();
gerarGrafico(); // Inicialmente com dólar
