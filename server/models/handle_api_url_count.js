"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class handle_api_url_count extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    handle_api_url_count.init(
        {
            date: DataTypes.STRING,
            url: DataTypes.STRING,
            count: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "handle_api_url_count",
        }
    );
    return handle_api_url_count;
};
