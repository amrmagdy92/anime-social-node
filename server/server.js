require('dotenv').config();
const cluster = require('cluster');
const process = require('process');
const http = require('http');
const CPU_COUNT = require('os').cpus().length;
const app = require('./app');

if (cluster.isMaster) {
    console.info(`Master process is running at ${process.pid}`);

    for (let i = 0; i < CPU_COUNT; i++) {
        cluster.fork();
        console.log(`Created worker #${i+1}`);
    }

    cluster.on('exit', (worker, code, signal) => {
        console.error(`Worker(${worker.process.pid}) died with code(${code}) and signal(${signal})`);
        cluster.fork();
    })
} else {
    http.createServer(app).listen(process.env.SERVER_PORT);
    console.log(`Server(${process.pid}) is listening at port(${process.env.SERVER_PORT})`);
};