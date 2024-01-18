'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('users', 'aboutMe', {
            type: Sequelize.STRING, // Или любой другой тип данных, который соответствует вашим требованиям
            allowNull: true,
        });

        await queryInterface.addColumn('users', 'links', {
            type: Sequelize.STRING, // Или любой другой тип данных, который соответствует вашим требованиям
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('users', 'aboutMe');
        await queryInterface.removeColumn('users', 'links');
    },
};
