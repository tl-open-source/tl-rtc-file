// user
module.exports = (sequelize, DataTypes) => {
     let User = sequelize.define('user', {
          id : {
               type: DataTypes.INTEGER,
               comment: '属于的用户唯一id，11位，暂不处理',
               primaryKey: true,
               autoIncrement : true
          },
          uid : {
               type: DataTypes.INTEGER,
               comment: '属于的用户唯一id，11位，暂不处理',
               unique: true
          },
          uname : {
               type: DataTypes.STRING(20),
               comment: '姓名'
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
          comment: '用户表'
     });
     return {
          User
     };
}
   