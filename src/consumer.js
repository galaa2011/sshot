const puppeteer = require('../src/puppeteer')
const queue = require('./queue')
const {saveScreenshot} = require('./dao')

const redis = require('redis')
let client = redis.createClient('redis://:No5CJ34Ai6vHpdNo5AKaDQmauVVyWNpTXMKQGStxuJi06vKwMQvug8Dms6jbXg9y@ogzpohhyopmn.redis.sae.sina.com.cn:10271', {no_ready_check: true, prefix: 'q-screenshot-result'})

module.exports = function consumer () {
  // 监控卡住的任务
  queue.watchStuckJobs(5000)
  queue.process('screenshot', 3, async (job, done) => {
    let buffer = await puppeteer(job.data.query)
    console.log(job.data, job.id, process.pid, buffer.toString())
    let _data = {user_id: job.data.user_id, job_id: job.data.job_id, file: buffer}
    client.set(job.data.job_id, buffer.toString(), (err, res) => {
      if (err) {
        return done(new Error('存储失败~'));
      }
      done()
    })
    await saveScreenshot(_data)
    // process.send({cmd: "screenshot", data: buffer})
    // done()
  })
}
