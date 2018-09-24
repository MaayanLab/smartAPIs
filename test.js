var validateSchema = require('openapi-schema-validation').validate
var glob = require('glob')
var process = require('process')
var yamljs = require('yamljs')

process.argv.slice(2).map(function(arg) {
  glob(arg, function(err, files) {
    if(err) {
      reject()
    } else {
      files.forEach(function(file) {
        var data = yamljs.load(file)
        var result = validateSchema(data, 3)
        if(result.errors.length > 0) {
          console.log('[ ERROR ]: ' + file)
          result.errors.forEach(console.error)
        } else {
          console.log('[ OK ]: ' + file)
        }
      })
    }
  })
})
