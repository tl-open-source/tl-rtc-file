// room
module.exports = (sequelize, DataTypes) => {
     let Room = sequelize.define('room', {
          id : {
               type: DataTypes.INTEGER,
               primaryKey: true,
               autoIncrement : true,
               unique: true,
               comment: '数据id',
          },
          rcode : {
               type: DataTypes.STRING(30),
               comment: '房间随机编号'
          },
          rname : {
               type: DataTypes.STRING(32),
               comment: '房间频道号码'
          },
          uid : {
               type: DataTypes.INTEGER,
               comment: '属于的用户id, 待定~',
          },
          uname : {
               type: DataTypes.STRING(20),
               comment: '姓名, 待定~'
          },
          sid : {
               type: DataTypes.STRING(30),
               comment: '进入房间时的sessionId'
          },
          pwd: {
               type: DataTypes.STRING(6),
               comment: '房间密码'
          },
          status : {
               type: DataTypes.INTEGER,
               comment: '房间状态',
               defaultValue : 0
          },
          ip : {
               type: DataTypes.STRING(32),
               comment: 'ip'
          },
          device : {
               type: DataTypes.STRING(256),
               comment: '设备'
          },
          localtion : {
               type: DataTypes.STRING(256),
               comment: '地理位置'
          },
          url : {
               type: DataTypes.STRING(256),
               comment: '请求url'
          },
          flag : {
               type: DataTypes.INTEGER,
               comment: '标志位',
               defaultValue: 0,
          },
          content : {
               type: DataTypes.TEXT,
               comment: '详细信息'
          }
     },{
          timestamps: true,
          comment: '房间表'
     });
     return {
          Room
     };
}
   