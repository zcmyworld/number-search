const Promise = require("bluebird");
const bluebird = require('bluebird');
const mysql = require('mysql');

var connection = Promise.promisifyAll(
  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'phone'
  })
);

exports.search = async function (searchkey) {
  let sql = 'select phone from phone where phone like (?) limit 0, 10';
  let args = [searchkey + '%'];
  let rs = await connection.queryAsync(sql, args);
  return rs;
}

// let co = require('co');


// co(async function () {
//   let rs = await exports.search('123');

//   console.log(rs)
// })
