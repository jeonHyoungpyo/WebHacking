const moment = require('moment');
      
module.exports = (sequelize, DataTypes) => {
  const Dress = sequelize.define('Dress', {
      name: {
        field: "name",
        type: DataTypes.STRING,
        allowNull: false,
      },
      thumbnail :{
        type: DataTypes.STRING
      },
      
      writer :{
        type: DataTypes.STRING,
        allowNull : false,
      },
      writer_id : {
        type: DataTypes.BIGINT.UNSIGNED,
       },

      price: {
        field:"price",
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      description: {
        field:"description",
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      timestamps: true
    });

    // 제품 모델 관계도
    Dress.associate = (models) => {
    
      // 메모 모델에 외부키를 건다
      // onDelete 옵션의 경우 제품 하나가 삭제되면 외부키가 걸린 메모들도 싹다 삭제해준다
      Dress.hasMany(models.ProductsMemo, {as: 'DMemo', foreignKey: 'Dress_id', sourceKey: 'id' , onDelete: 'CASCADE'});
      Dress.belongsTo(models.User,{as : 'DOwner',foreignkey:'user_id',targetkey:'id'});
    }, 
  
    // 년-월-일
    Dress.prototype.dateFormat = (date) => (
      moment(date).format('YYYY-MM-DD')
  );

  return Dress;

  };

