const bcryptjs = require('bcryptjs');

const hashPassword = (password) => {
  return bcryptjs.hashSync(password, bcryptjs.genSaltSync(10));
};

const comparePassword = (password, hashPassword) => {
  return bcryptjs.compareSync(password, hashPassword);
};

module.exports = {
  hashPassword,
  comparePassword,
};
