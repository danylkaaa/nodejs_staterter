const express = require('express');
const validate = require('express-validation');
const paramValidation = require('@config/param-validation');
const userCtrl = require('./user.controller');
const config = require('@config/config');
const expressJwt = require('express-jwt');
const authorization = require('@config/passport');

const router = express.Router(); // eslint-disable-line new-cap

router
  .route('/')
  .post(
    expressJwt({
      secret: config.jwtSecretPhoneConfirmation
    }),
    validate(paramValidation.createUser),
    userCtrl.create
  )
  .delete(authorization.basicUser, userCtrl.remove);

module.exports = router;
