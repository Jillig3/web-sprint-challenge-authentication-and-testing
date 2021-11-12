const User = require('./../users/user-model')
const bcrypt = require('bcryptjs')

function validateBody(req, res, next) {
    const { username, password } = req.body
    if (username === undefined || password === undefined) {
      res.status(400).json({ message: 'username and password required'})
    } else {
      next()
    }
}
  
async function checksUsernameIsFree(req, res, next){
    const username = req.body.username
    const checkForName = await User.findBy({ username })
  
    if (checkForName) {
      res.status(422).json({ message: "username taken" })
    } else {
      next()
    }
}

async function checkUserRegistered(req, res, next) {
    const { username, password } = req.body
    
    try {
        let userSearch = await User.findBy({ username })
        if (!userSearch) {
            next({ status: 401, message: 'invalid credentials' })
        } else {
            if (userSearch && bcrypt.compareSync(password, userSearch.password)) {
                next()
            } else {
                next({ status: 401, message: 'invalid credentials' })
            }
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    validateBody,
    checksUsernameIsFree,
    checkUserRegistered
}