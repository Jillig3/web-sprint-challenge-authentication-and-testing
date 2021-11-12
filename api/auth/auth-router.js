const router = require('express').Router();
const bcrypt = require('bcryptjs')
const { BCRYPT_ROUNDS } = require('./../secrets/index')
const User = require('./../users/user-model')
const buildToken = require('./token-builder')
const { 
  checksUsernameIsFree, 
  validateBody,
  checkUserRegistered 
} = require('./auth-middleware')

router.get('/', (req, res, next) => {
  User.getAll()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next)
})

router.get('/:id', (req, res, next) => {
  User.getById(req.params.id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(next)
})

router.post('/register', validateBody, checksUsernameIsFree, (req, res, next) => {
  let user = req.body
  const rounds = parseInt(BCRYPT_ROUNDS) || 8
  const hash = bcrypt.hashSync(user.password, rounds)
  user.password = hash

  User.insert(user)
    .then((newUser) => {
      res.status(201).json(newUser)
    })
    .catch(next)
});

router.post("/login", validateBody, checkUserRegistered, (req, res, next) => {
  const user = req.body
  const token = buildToken(user)
  console.log(token)
  try {
    res.status(200).json({
      message: `Welcome, ${user.username}`,
      token
    })
  } catch(err){
    next(err)
  }
});

module.exports = router;