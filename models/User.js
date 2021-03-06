const passwordHash = require('../helpers/passwordHash');

module.exports = function(sequelize, DataTypes){
    const User = sequelize.define('User',
        {
            id: { type: DataTypes.BIGINT.UNSIGNED,
                 primaryKey: true, 
                 autoIncrement: true },
            name : { 
                type: DataTypes.STRING,
                validate : {
                    len : [0, 50]
                },
                allowNull : false,
               
            },    
            username : { 
                type: DataTypes.STRING,
                validate : {
                    len : [0, 50]
                },
                allowNull : false,
               
            },
            confirmvalue : { 
                type: DataTypes.STRING,
                validate : {
                    len : [0, 50]
                },
                allowNull : true,
               
            },
            email : { 
                type: DataTypes.STRING,
                validate : {
                    len : [0, 50]
                },
                allowNull : false,
               
            },
            password : { 
                type: DataTypes.STRING,
                validate : {
                    len : [3, 100]
                } ,
                allowNull : false
            },
            phone : { 
                type: DataTypes.STRING,
                validate : {
                    len : [0, 50]
                },
                allowNull : false,
               
            },
            gender : { 
                type: DataTypes.STRING,
                validate : {
                    len : [0, 50]
                },
                allowNull : false,
               
            },
            Year : { 
                type: DataTypes.STRING,
                validate : {
                    len : [0, 50]
                },
                allowNull : false,
               
            },
            Month : { 
                type: DataTypes.STRING,
                validate : {
                    len : [0, 50]
                },
                allowNull : false,
               
            },
            Day : { 
                type: DataTypes.STRING,
                validate : {
                    len : [0, 50]
                },
                allowNull : false,
               
            },
            
            displayname : { type: DataTypes.STRING }

        },{
            tableName: 'User'
        }
    );

    User.beforeCreate((user,_)=>{
        user.password = passwordHash(user.password);
    });

    
    // 제품 모델 관계도
User.associate = (models) => {

    // 메모 모델에 외부키를 건다
    // onDelete 옵션의 경우 제품 하나가 삭제되면 외부키가 걸린 메모들도 싹다 삭제해준다 단 sync를 다시 해줘야됨
    // as 의 경우 모델명과 똑같이 하지 않는다 Products (x)
    User.hasMany(
        models.product, 
        {   
            as: 'Product', 
            foreignKey: 'user_id', 
            sourceKey: 'id' , 
            onDelete: 'CASCADE'
        }
    );
 
    //Dress table
    User.hasMany(
        models.Dress, 
        {   
            as: 'Dress', 
            foreignKey: 'Dress_id', 
            sourceKey: 'id' , 
            onDelete: 'CASCADE'
        }
    );

    //Design table
    User.hasMany(
        models.Design, 
        {   
            as: 'Design', 
            foreignKey: 'Design_id', 
            sourceKey: 'id' , 
            onDelete: 'CASCADE'
        }
    );
};
    

    return User;
}