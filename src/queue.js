const kue = require('kue')
const queue = kue.createQueue({
  prefix: 'q-screenshot',
  redis: {
    port: 10271,
    host: 'ogzpohhyopmn.redis.sae.sina.com.cn',
    auth: 'No5CJ34Ai6vHpdNo5AKaDQmauVVyWNpTXMKQGStxuJi06vKwMQvug8Dms6jbXg9y',
    // db: 3, // if provided select a non-default redis db
    options: {
      // see https://github.com/mranney/node_redis#rediscreateclient
    }
  }
})
module.exports = queue
