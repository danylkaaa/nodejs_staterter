const User = require('./user.model');
const httpStatus = require('http-status');
const APIError = require('@helpers/APIError');
/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.fullname - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @property {string} req.body.password - The password of user.
 * @returns {User}
 */
function create(req, res, next) {
  // check is user alredy exist
  User.findOne({ email: req.body.email })
    .exec()
    .then((result) => {
      if (result === null) {
        const user = new User({
          email: req.body.email,
          fullname: req.body.fullname,
          mobileNumber: req.body.mobileNumber,
          password: req.body.password
        });
        user
          .save()
          .then(() => res.json({
            message: 'Check your email'
          }))
          .catch(e => next(e));
      } else {
        next(new APIError('Email is already used', httpStatus.BAD_REQUEST));
      }
    });
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function update(req, res, next) {
  const { user } = req;
  user.username = req.body.username || user.username;
  user.mobileNumber = req.body.mobileNumber || user.mobileNumber;
  user.address = req.body.address || user.address;
  user.imageUrl = req.body.imageUrl || user.imageUrl;

  user
    .update(req.body)
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */

function remove(req, res, next) {
  const { user } = req;
  user
    .remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

module.exports = {
  load,
  get,
  create,
  update,
  list,
  remove
};
