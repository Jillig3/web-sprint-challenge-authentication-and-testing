module.exports = {
    PORT: process.env.PORT || 3300,
    JWT_SECRET: process.env.JWT_SECRET || 'shh secret',
    BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 6
}