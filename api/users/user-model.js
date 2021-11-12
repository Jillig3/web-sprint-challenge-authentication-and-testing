const db = require('../../data/dbConfig')

function getAll() {
    return db('users')
}

async function getById(id) {
    return await db('users as u')
        .where({ id })
        .first()
}

async function insert(user) {
    const [id] = await db('users').insert(user)
    return getById(id)
}

async function remove(id) {
    return await db('users').where({ id }).del()
}

async function findBy(filter) {
    return await db('users').where(filter).first()
}

module.exports = {
    getAll,
    getById,
    insert,
    remove,
    findBy
}