const mysql = require('mysql')
const connection = mysql.createConnection({
  host     : 'nymcovwiymla.mysql.sae.sina.com.cn',
  port     : '10512',
  user     : 'zhao',
  password : '123456',
  database : 'screenshot'
})
let Dao = {
  fetchUser (name, password) {
    // connection.connect()
    return new Promise((resolve, reject) => {
      connection.query(`select * from user where name='${name}' and password='${password}';`, (error, results, fields) => {
        // connection.end()
        if (error) reject(error)
        resolve(results[0])
      })
    })
  },
  saveScreenshot (data) {
    return new Promise((resolve, reject) => {
      let query = 'insert into `job` SET ?'
      let values = {
        user_id: data.user_id,
        job_id: data.job_id,
        file: data.file
      }
      connection.query(query, values, (error, results, fields) => {
        if (error) reject(error)
        resolve(results)
      })
    })
  },
  fetchJob (id) {
    // connection.connect()
    return new Promise((resolve, reject) => {
      connection.query(`select * from job where job_id='${id}';`, (error, results, fields) => {
        // connection.end()
        if (error) reject(error)
        resolve(results[0])
      })
    })
  }
}
module.exports = Dao
