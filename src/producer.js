const kue = require('kue')
const queue = kue.createQueue({
  prefix: 'q-test',
  redis: {
    port: 10271,
    host: 'ogzpohhyopmn.redis.sae.sina.com.cn',
    auth: 'No5CJ34Ai6vHpdNo5AKaDQmauVVyWNpTXMKQGStxuJi06vKwMQvug8Dms6jbXg9y',
    db: 3, // if provided select a non-default redis db
    options: {
      // see https://github.com/mranney/node_redis#rediscreateclient
    }
  }
})
let index = 0
setInterval(() => {
  index++
  (function (index) {
    let job = queue.createJob('email', 10, {
      title: '真牛逼--- test' + index
    }).save()
    
    job.on('complete', (result) => {
      console.log('complete---' + index, job.id, result)
    }).on('failed', err => {
      console.log('failed' + index, err)
    }).on('progress', (progress, data) => {
      console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data)
    });
  })(index)
}, 3000)
