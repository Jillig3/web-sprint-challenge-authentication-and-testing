exports.seed = function(knex) {
    return knex('users').truncate()
        .then(function () {
            return knex('users').insert([
                { username: 'test', password: 'test' },
                { username: 'becca', password: '$2a$06$zdJtIaCBO/DQHP.E6AiTGOVvDEw2xbySUCx/iAYiSLbfoEbXMXG0O' },
                { username: 'jake', password: 'jake123' },
            ]);
        });
};