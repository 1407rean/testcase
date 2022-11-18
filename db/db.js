/**
 *  数据库文件
 */

const mysql = require("mysql");

const db = mysql.createPool({
  host: "81.69.39.232",
  user: "tom",
  password: "321qweDSAzxc",
  database: "zhd_test",
});

module.exports = db; 
