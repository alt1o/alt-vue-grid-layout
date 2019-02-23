let fs = require('fs');

let pkg = require('../package.json');
pkg.dependencies = {};
pkg.devDependencies = {};

fs.writeFile('../package.json', JSON.stringify(pkg), (err) => {
    if(err) throw err;
})