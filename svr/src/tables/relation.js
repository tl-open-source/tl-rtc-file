// relation
module.exports = (sequelize, DataTypes) => {
	return {
		Relation: sequelize.define('relation', {
			id: {
				type: DataTypes.INTEGER,
				comment: '关联id',
				primaryKey: true,
				autoIncrement: true
			},
			type: {
				type: DataTypes.STRING(20),
				comment: '关联类型'
			},
			source_id: {
				type: DataTypes.STRING(25),
				comment: '源对象id'
			},
			target_id: {
				type: DataTypes.STRING(25),
				comment: '关联对象id'
			},
			flag: {
				type: DataTypes.INTEGER,
				comment: '标志位',
				defaultValue: 0,
			}
		}, {
			timestamps: true,
			comment: '关联记录表',
			indexes: [{
				name: 'created_at_index',
				method: 'BTREE',
				fields: ['created_at']
			}]
		})
	};
}
