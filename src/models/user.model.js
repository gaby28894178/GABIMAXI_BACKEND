import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

let User = null

if (sequelize) {
  User = sequelize.define('sec_users', {
    login: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    pswd: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    active: {
      type: DataTypes.STRING(1),
      defaultValue: 'Y'
    },
    institucion_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tipo_usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    profesional_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    paciente_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    twofa_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    f_insert: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    f_update: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'sec_users',
    timestamps: false, // We manage f_insert/f_update manually or via hooks
    hooks: {
      beforeUpdate: (user) => {
        user.f_update = new Date()
      }
    }
  })
}

export default User
