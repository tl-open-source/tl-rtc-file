// user
module.exports = (sequelize, DataTypes) => {
	return {
		UserOther : {
			Flag : {
				IS_SUBSCRIBE_WEBSITE_NOTIFY : 0x1, //是否已订阅网站通知
			}
		},
		User: sequelize.define('user', {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				unique: true,
				comment: '数据id',
			},
			type: {
				type: DataTypes.STRING(6),
				comment: '帐号类型, wx, qq, wb, web, other'
			},
            openid: {
                type: DataTypes.STRING(64),
				comment: '微信openid'
            },
            avatar : {
                type: DataTypes.STRING(512),
				comment: '头像地址'
            },
			uname: {
				type: DataTypes.STRING(20),
				comment: '姓名，昵称'
			},
			pwd : {
				type: DataTypes.STRING(12),
				comment: '用户密码'
			},
			solt : {
				type: DataTypes.STRING(32),
				comment: '加密solt'
			},
			role: {
				type: DataTypes.STRING(15),
				comment: '用户身份'
			},
			flag: {
				type: DataTypes.INTEGER,
				comment: '标志位',
				defaultValue: 0,
			}
		}, {
			timestamps: true,
			comment: '用户表',
			indexes: [{
				name: 'created_at_index',
				method: 'BTREE',
				fields: ['created_at']
			}]
		})
	};
}