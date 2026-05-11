const { createServer } = require('http');
const next = require('next');

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });
  
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Custom server ready on http://localhost:3000');
  });
  
  process.on('exit', (code) => {
    console.log(`> Process exiting with code: ${code}`);
  });
  
  process.on('SIGTERM', () => {
    console.log('> Received SIGTERM');
    server.close(() => process.exit(0));
  });
  
  process.on('SIGINT', () => {
    console.log('> Received SIGINT');
    server.close(() => process.exit(0));
  });
});
