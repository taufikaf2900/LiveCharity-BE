const bcryptjs = require('bcryptjs');
// console.log('asd');
console.log(bcryptjs.hashSync('ranggaxxx', bcryptjs.genSaltSync(10)));

// console.log(new Date().getTime());
