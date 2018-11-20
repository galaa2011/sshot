const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const consumer = require('../src/consumer');
const puppeteer = require('../src/puppeteer');

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);
  require('../bin/www');
  // 衍生工作进程。
  for (let i = 0; i < numCPUs; i++) {
    let worker = cluster.fork();
    // worker.on('message', async msg => {
    //   console.log(msg)
    //   let buffer = await puppeteer({query: msg.data})
    //   console.log(buffer)
    // })
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });
} else {
  console.log(`工作进程 ${process.pid} 已启动`);
  consumer()
}
