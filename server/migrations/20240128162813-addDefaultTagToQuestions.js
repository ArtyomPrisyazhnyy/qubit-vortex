'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Находим вопросы, не связанные с каким-либо тегом
        const questionsWithoutTags = await queryInterface.sequelize.query(
            `SELECT id FROM question WHERE id NOT IN (SELECT "questionId" FROM question_tags);`
        );

        // Добавляем связи вопросов с тегом по умолчанию
        const defaultTagId = 2; // ID тега по умолчанию
        for (const question of questionsWithoutTags[0]) {
            await queryInterface.sequelize.query(
                `INSERT INTO question_tags ("questionId", "tagsId") VALUES (${question.id}, ${defaultTagId});`
            );
        }
    },

    down: async (queryInterface, Sequelize) => {
        // Удаляем добавленные связи (это обратная операция)
        await queryInterface.sequelize.query(
            `DELETE FROM question_tags WHERE tagsId = 2;`
        );
    }
};
