require('module-alias/register');
const httpStatus = require('http-status');
const APIError = require('@helpers/APIError');
// const config = require('@config/config');
const User = require('@server/user/user.model');

/**
 * Returns new generated access token
 */
function token(req, res, next) {
  User.findById(req.user.id)
    .exec()
    .then(user => res.json(user.genJWTAccessToken()))
    .catch((err) => {
      next(err);
    });
}
/**
 * Returns jwt token if valid username and password is provided
 */
function login(req, res, next) {
  User.getByCredentials(req.body)
    .then(user => res.json({
      user: user.publicInfo(),
      tokens: user.genAuthTokens()
    }))
    .catch(() => {
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
      return next(err);
    });
}
// /**
//  * Returns user
//  */
// function get(req, res) {
//   // req.user is assigned by jwt middleware if valid token is provided
//   return res.json({
//     ...req.user.user,
//     password: undefined
//   });
// }

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 */
function check(req, res) {
  return res.json({
    status: true
  });
}

/**
 * Activate account
 */
async function confirmMail(req, res, next) {
  const user = await User.findById(req.user.id).exec();
  if (user.isEmailVerified) {
    return next(new APIError('This account is already actiated', httpStatus.BAD_REQUEST, true));
  }
  user.isEmailVerified = true;
  await user.save();
  return res.status(httpStatus.OK).json({ message: 'activated' });
}

module.exports = {
  check,
  login,
  token,
  confirmMail
};
