const Sql = require('sequelize');
const fs = require('fs');

let sql = null;
let models = {};


//export outside
function excute(config) {
  init(config);

  return {
    tables : models,
    sql : sql,
    Sql : Sql
  };
}


//main 
function init(config) {
  if(config.db.beforeInit){
    config.db.beforeInit();
  }

  let dbConf = config.db.mysql;
  sql = new Sql(dbConf.dbName, dbConf.user, dbConf.password, dbConf.other.sequelize);
  connectDb(sql);
  initTable(sql);
  syncDb(sql);

  if(config.db.afterInit){
    config.db.afterInit();
  }
}


//connect to db
async function connectDb(sql){
  try {
    let connect = await sql.authenticate();
    console.log('连接成功');
  } catch (e) {
    console.log('连接失败');
  }
}

//init table
async function initTable() {
  let files = fs.readdirSync(__dirname);
  for (let f of files) {
    if (f[0] == '.' || f == 'db.js') continue;
    try {
        let fn = require('./' + f);
        if (typeof fn == 'function') {
              let ms = fn(sql, Sql);
              for (let k in ms) {
                  models[k] = ms[k];
              }
        }
    } catch (e) {
        console.log(e);
    }
  }
}

// sync db tables
async function syncDb(sql) {
  try{
    let res = sql.sync({
      force: false
    });
    console.log("同步成功");
  }catch(e){
    console.log("同步失败");
  }
}

//other init methods ...

module.exports = {
  excute
}
