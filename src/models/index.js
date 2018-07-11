const mongoose = require('mongoose');

const UserSchema = require('./user');
const PublishSchema = require('./publish');

const { mongodb } = require('../config');

const uri = `mongodb://${mongodb.host}:${mongodb.port}/${mongodb.database}`;

mongoose.connect(uri, {
  poolSize: 10,
  user: mongodb.user,
  pass: mongodb.pass
});

mongoose.connection.on('connected', () => {
  console.log(`数据库连接成功: ${uri}`);
});

mongoose.connection.on('error', (err) => {
  console.error(`数据库连接异常: ${err}`);
  mongoose.disconnect();
});

mongoose.connection.on('disconnected', () => {
  console.log('数据库连接断开');
});

mongoose.model('user', UserSchema);
mongoose.model('publish', PublishSchema);

module.exports = function(name) {
  name = name.toLowerCase();
  return mongoose.model(name);
};
