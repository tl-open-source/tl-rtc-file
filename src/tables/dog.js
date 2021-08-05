// dog
module.exports = (sequelize, DataTypes) => {
     let Dog = sequelize.define('dog', {
          id : {
               type: DataTypes.INTEGER,
               comment: '功能id',
               primaryKey: true,
               autoIncrement : true
          },
          name : {
               type: DataTypes.STRING(20),
               comment: '操作功能id'
          },
          module : {
               type: DataTypes.INTEGER,
               comment: '所属的模块'
          },
          uid : {
               type: DataTypes.INTEGER,
               comment: '添加功能的用户，属于的用户唯一id，11位，暂不处理',
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
          comment: '功能记录表'
     });
     return {
          Dog
     };
}
   