const bcryptjs = require('bcryptjs');
// console.log('asd');

console.log(bcryptjs.hashSync('dudungxxx', bcryptjs.genSaltSync(10)));
console.log(bcryptjs.compareSync('123', '$2a$10$CjHsyPlBa.fe3Db8biBY8emcmeEa6DdBMPhWXo6Wg0kDfPnA69GGy'));
// console.log(new Date().getTime());
