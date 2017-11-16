
let redis = require('redis');
let mysql = require('mysql');
let co = require('co');

const Promise = require("bluebird");
const bluebird = require('bluebird');


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var connection = Promise.promisifyAll(
  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'phone'
  })
);


let redisClient = redis.createClient({
  port: '7000',
  host: '127.0.0.1'
});

function randomStr(len = 8) {
  let final = "";
  for (let i = 0; i < len; i++) {
    final = final + Math.round(Math.random() * 9).toString();
  }
  return final;
}

async function init() {
  let start_time = new Date().getTime();
  for (let i = 0; i < 1; i++) {
    console.log(i)
    let phonenum = randomStr(11);
    await redisClient.zaddAsync('phone', 0, phonenum);
    let sql = 'insert into phone (phone) values (?)';
    let args = [phonenum];
    // await connection.queryAsync(sql, args);
  }
  let end_time = new Date().getTime();
  console.log('Init Finish')
  console.log('Start..' + start_time);
  console.log('End..' + end_time);
  console.log('Use_time .. ' + (end_time - start_time));
}

co(async function () {
  await init()
  return
})

