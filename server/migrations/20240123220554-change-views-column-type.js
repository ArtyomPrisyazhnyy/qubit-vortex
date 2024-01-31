'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('question', 'views', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        });
    },
};