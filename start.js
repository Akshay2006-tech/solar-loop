const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numCPUs = Math.min(os.cpus().length, 4);
  console.log(`Starting ${numCPUs} workers...`);
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });
} else {
  require('./server.js');
}