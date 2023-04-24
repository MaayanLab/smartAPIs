const fs = require('fs')
const path = require('path')
process.argv.slice(2).map(function(filename) {
  const name = path.basename(filename, '_smartapi.yml')
  if (!fs.existsSync(path.join('build', name))) fs.mkdirSync(path.join('build', name))
  fs.copyFileSync(filename, path.join('build', name, 'openapi.yml'))
  fs.copyFileSync(path.join(__dirname, 'template.html'), path.join('build', name, 'index.html'))
})