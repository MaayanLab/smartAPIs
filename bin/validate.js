var OpenAPISchemaValidator = require('openapi-schema-validator').default
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
        var validator = new OpenAPISchemaValidator({version: 3})
        var result = validator.validate(data)
        if(result.errors.length > 0) {
          console.log(`[ ERROR ] ${file}: ${result.errors}`)
        } else {
          console.log(`[ OK ] ${file}`)
        }
      })
    }
  })
})
