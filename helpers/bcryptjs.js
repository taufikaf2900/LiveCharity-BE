const bcryptjs = require('bcryptjs');

const hashPassword = (plainPassword) => {
  const salt = bcryptjs.genSaltSync(10);
  const hashedPassword = bcryptjs.hashSync(plainPassword, salt);
  return hashedPassword;
};

const comparePassword = (plainPassword, hashedPassword) => {
  return bcryptjs.compareSync(plainPassword, hashedPassword);
};

module.exports = {
  hashPassword,
  comparePassword
}