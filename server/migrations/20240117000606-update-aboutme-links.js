'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('users', 'aboutMe', {
            type: Sequelize.TEXT,
            allowNull: true,
        });

        await queryInterface.changeColumn('users', 'links', {
            type: Sequelize.TEXT,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('users', 'aboutMe', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.changeColumn('users', 'links', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    }
};
