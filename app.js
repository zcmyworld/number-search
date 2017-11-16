
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

async function mysqlSearch(searchkey) {
  let sql = 'select phone from phone where phone like (?)';
  let args = [searchkey + '%'];
  let rs = await connection.queryAsync(sql, args);
  return rs;
}


async function getAutoSearchStr(str) {
  let prefix = `${str}/`;
  let suffix = `${str}:`;

  await redisClient.zaddAsync('phone', 0, prefix);
  await redisClient.zaddAsync('phone', 0, suffix);

  let prefixRank = await redisClient.zrankAsync('phone', prefix);
  let sufffixRank = await redisClient.zrankAsync('phone', suffix);


  let start = prefixRank + 1;
  let end = sufffixRank - 1;

  // if (start + 10 < end) {
  //   end = start + 9;
  // }

  let rs = await redisClient.zrangeAsync('phone', start, end);
  let remprefix = await redisClient.zremAsync('phone', prefix);
  let remsuffix = await redisClient.zremAsync('phone', suffix);

  return rs;
}

const TEST_COUNT = 10;
function sleep(milliSeconds) {
  var startTime = new Date().getTime();
  while (new Date().getTime() < startTime + milliSeconds);
};

co(async function () {
  sleep(5000);

  for (let i = 0; i < TEST_COUNT; i++) {
    let test_str = randomStr(4);
    // console.log(test_str)
    // let test_str = "1234"

    let start_time = new Date().getTime();
    let rs = await getAutoSearchStr(test_str);
    let end_time = new Date().getTime();

    console.log('RedisResult##################################');
    // console.log(rs)

    console.log('start..' + start_time);
    console.log('end..' + end_time);
    console.log('use_time .. ' + (end_time - start_time));

    let mysql_start_time = new Date().getTime();
    // let mysql_rs = await mysqlSearch(test_str)
    let mysql_end_time = new Date().getTime();
    // console.log('MySQLResult##################################');
    // console.log('start..' + mysql_start_time);
    // console.log('end..' + mysql_end_time);
    // console.log('use_time .. ' + (mysql_end_time - mysql_start_time));
  }
})

