// dog
module.exports = (sequelize, DataTypes) => {
     return {
          Dog : sequelize.define('dog', {
               id : {
                    type: DataTypes.INTEGER,
                    comment: '功能id',
                    primaryKey: true,
                    autoIncrement : true
               },
               name : {
                    type: DataTypes.STRING(20),
                    comment: '操作功能名称'
               },
               room_id : {
                    type: DataTypes.STRING(25),
                    comment: '房间号'
               },
               socket_id : {
                    type: DataTypes.STRING(25),
                    comment: '连接id'
               },
               device : {
                    type: DataTypes.STRING(256),
                    comment: '设备'
               },
               flag : {
                    type: DataTypes.INTEGER,
                    comment: '标志位',
                    defaultValue: 0,
               },
               content : {
                    type: DataTypes.TEXT,
                    comment: '详细信息'
               },
               handshake : {
                    type: DataTypes.TEXT,
                    comment: '客户端信息'
               }
          },{
               timestamps: true,
               comment: '功能记录表',
               indexes: [{
                    name: 'created_at_index',
                    method: 'BTREE',
                    fields: ['created_at']
               }]
          })
     };
}
   