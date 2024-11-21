const express = require('express');
const app = express();

// Middleware para interpretar JSON no corpo da requisição
app.use(express.json());

// Importa o arquivo de rotas
const task = require('./routes/task');

// Usa as rotas para o caminho "/task"
app.use('/task', task);


// Iniciar o servidor
app.listen(3000, () => {
  console.log('Server running on port 3000');
});