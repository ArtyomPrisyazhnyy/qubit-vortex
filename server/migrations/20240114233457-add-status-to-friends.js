'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('friends', 'status', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'pending', // Значение по умолчанию
        });

        // Обновление значений в колонке "status" в зависимости от "isAccepted"
        await queryInterface.sequelize.query(`
            UPDATE friends
            SET status = CASE WHEN "isAccepted" = true THEN 'accepted' ELSE 'pending' END
        `);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('friends', 'status');
    },
};
