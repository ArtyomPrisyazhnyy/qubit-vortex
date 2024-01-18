'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('friends', 'isAccepted');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('friends', 'isAccepted', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        });
    },
};
