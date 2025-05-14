const venom = require('venom-bot');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

let client; // Será iniciado com o Venom


venom
  .create({
    session: 'bot-api',
    headless: false,
    browserArgs: ['--no-sandbox'],
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  })
  .then((c) => {
    client = c;
    console.log('🤖 Bot pronto!');
    startServer(); // inicia a API depois que o bot está pronto
  })
  .catch((erro) => {
    console.error('Erro ao iniciar o bot:', erro);
  });

// Função de envio
async function sendMassMessage(numbers, message) {
  for (const number of numbers) {
    const formatted = number.replace(/\D/g, ''); // remove caracteres
    const fullNumber = `55${formatted}@c.us`; // Brasil + número

    try {
      await client.sendText(fullNumber, message);
      console.log(`✅ Mensagem enviada para ${formatted}`);
      await delay(3000); // espera 3 segundos entre mensagens
    } catch (err) {
      console.error(`❌ Erro ao enviar para ${formatted}:`, err.message);
    }
  }
}
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Servidor API
function startServer() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(express.static('public'));


  app.post('/disparar', async (req, res) => {
    const { numeros, mensagem } = req.body;
    console.log("📨 Requisição recebida:", req.body);
    if (!numeros || !mensagem) {
      return res.status(400).json({ erro: 'Informe os campos: numeros (array) e mensagem (string).' });
    }

    await sendMassMessage(numeros, mensagem);
    res.json({ status: 'Mensagens enviadas' });
  });

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`🚀 API disponível em http://localhost:${PORT}`);
  });
}
// Mantém o terminal aberto
process.stdin.resume();
