'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('question', 'views', {
            type: Sequelize.BIGINT,
            allowNull: false,
            defaultValue: 0,
            after: 'fullDescription', // Указываем, после какой колонки в таблице добавить новую
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('question', 'views');
    }
};
