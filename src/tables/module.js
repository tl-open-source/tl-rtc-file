// module
module.exports = (sequelize, DataTypes) => {
    let Module = sequelize.define('module', {
         id : {
              type: DataTypes.INTEGER,
              comment: 'id',
              primaryKey: true,
              autoIncrement : true
         },
         name : {
              type: DataTypes.STRING(20),
              comment: '模块名称',
              defaultValue: "",
         },
         uid : {
              type: DataTypes.INTEGER,
              comment: '添加功能的用户，属于的用户唯一id，11位，暂不处理',
              unique: true,
              defaultValue: 0,
         },
         uname : {
              type: DataTypes.STRING(20),
              comment: '姓名',
              defaultValue: "",
         },
         flag : {
            type: DataTypes.INTEGER,
            comment: '标志位',
            defaultValue: 0,
        },
         content : {
              type: DataTypes.TEXT,
              comment: '数据content'
         },
         other : {
              type: DataTypes.TEXT,
              comment: '其他数据'
         },
    },{
         timestamps: true,
         comment: '功能模块表'
    });
    return {
        Module
    };
}
