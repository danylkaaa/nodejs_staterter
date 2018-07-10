require('module-alias/register');
const chai = require('chai'); // eslint-disable-line import/newline-after-import
const { expect } = chai;
const config = require('@config/config');

const expectUser = (user, etaloneFields = {}) => {
  expect(user).to.be.an('object');
  expect(user).to.have.all.keys([
    'id',
    'fullname',
    'createdAt',
    'updatedAt',
    'email',
    'mobileNumber'
  ]);
  Object.keys(etaloneFields).forEach((key) => {
    expect(user[key]).to.be.equal(etaloneFields[key]);
  });
};

const expectAccessJWTToken = (token) => {
  expect(token).to.be.an('object');
  expect(token).have.all.keys(['token', 'expiredIn']);
  expect(token.token).to.be.a('string');
  expect(token.expiredIn).to.be.a('number');
  expect(token.expiredIn).to.be.most(Math.floor(Date.now() / 1000) + config.jwtExpAccess);
  expect(token.expiredIn).to.be.gt(Math.floor(Date.now() / 1000));
};

const expectRefreshJWTToken = (token) => {
  expect(token).to.be.an('object');
  expect(token).have.all.keys(['token', 'expiredIn']);
  expect(token.token).to.be.a('string');
  expect(token.expiredIn).to.be.a('number');
  expect(token.expiredIn).to.be.least(Math.floor(Date.now() / 1000) + config.jwtExpRefresh);
  expect(token.expiredIn).to.be.gt(Math.floor(Date.now() / 1000));
};
const expectAuthTokens = (tokens) => {
  expect(tokens).to.be.an('object');
  expect(tokens).have.all.keys(['access', 'refresh']);
  expectAccessJWTToken(tokens.access);
  expectRefreshJWTToken(tokens.refresh);
};

module.exports = {
  expectAccessJWTToken,
  expectRefreshJWTToken,
  expectAuthTokens,
  expectUser
};
