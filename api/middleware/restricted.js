const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./../secrets')
function restricted(req, res, next) {
  const token = req.headers.authorization

  if (!token) {
    return next({ status: 401, message: 'token required'})
  }
 jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return next({ status: 401, message: 'token Invalid'})
    }
    req.decodedToken = decodedToken
      return next()
 })
}

module.exports = {
  restricted
}