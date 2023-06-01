// file
module.exports = (sequelize, DataTypes) => {
	return {
		File: sequelize.define('file', {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				unique: true,
				comment: '数据id',
			},
			room_id: {
				type: DataTypes.STRING(16),
				comment: '房间号'
			},
			code: {
				type: DataTypes.STRING(128),
				comment: '取件码'
			},
			name: {
				type: DataTypes.STRING(256),
				comment: '文件名称'
			},
			oss_name: {
				type: DataTypes.STRING(256),
				comment: 'oss中的文件名称'
			},
			download: {
				type: DataTypes.STRING(256),
				comment: '下载链接'
			},
			content: {
				type: DataTypes.TEXT,
				comment: '详细信息'
			},
		}, {
			timestamps: true,
			comment: '房间表',
			indexes: [{
				name: 'code_index',
				method: 'BTREE',
				fields: ['code']
			}]
		})
	};
}
