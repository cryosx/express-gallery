const http = require('http');
const app = require('./server');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  process.stdout.write(`Server listening on port: ${PORT}`)
});