const queue = require('./queue')

module.exports = function producer(ctx, job_id) {
  let job = queue.create('screenshot', {
    job_id,
    user_id: ctx.state.user.id,
    query: ctx.query
  }).ttl(60000).attempts(5).save()
  
  job.on('complete', result => {
    console.log('complete---', job.id)
  }).on('failed', err => {
    console.log('failed---', job.id)
  }).on('progress', (progress, data) => {
    console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data)
  })
}
