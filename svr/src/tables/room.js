// room
module.exports = (sequelize, DataTypes) => {
	return {
		Room: sequelize.define('room', {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				unique: true,
				comment: '数据id',
			},
			room_id: {
				type: DataTypes.STRING(32),
				comment: '房间频道号码'
			},
			uid: {
				type: DataTypes.INTEGER,
				comment: '匿名用户的id',
			},
			uname: {
				type: DataTypes.STRING(20),
				comment: '匿名用户姓名，昵称'
			},
			socket_id: {
				type: DataTypes.STRING(30),
				comment: '匿名用户进入房间时的socket.id'
			},
			pwd: {
				type: DataTypes.STRING(6),
				comment: '房间密码'
			},
			status: {
				type: DataTypes.INTEGER,
				comment: '房间状态',
				defaultValue: 0
			},
			ip: {
				type: DataTypes.STRING(32),
				comment: 'ip'
			},
			device: {
				type: DataTypes.STRING(256),
				comment: '设备信息'
			},
			flag: {
				type: DataTypes.INTEGER,
				comment: '标志位',
				defaultValue: 0,
			},
			content: {
				type: DataTypes.TEXT,
				comment: '详细信息'
			}
		}, {
			timestamps: true,
			comment: '匿名用户房间表',
			indexes: [{
				name: 'created_at_index',
				method: 'BTREE',
				fields: ['created_at']
			}]
		})
	};
}
