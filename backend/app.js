const express = require('express');
const app = express();

// Middleware per leggere JSON
app.use(express.json());

// Route di test
app.get('/', (req, res) => {
  res.send('API BetterTrento attiva!');
});

// Avvio server
app.listen(3000, () => {
  console.log('Server avviato sulla porta 3000');
});
