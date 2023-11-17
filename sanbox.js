const bcryptjs = require('bcryptjs');
console.log('asd');
console.log(bcryptjs.hashSync('123', bcryptjs.genSaltSync(10)));
