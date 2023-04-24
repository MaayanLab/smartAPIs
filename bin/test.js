var Swagger = require('swagger-client')
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
        Swagger({ spec: data }).then(function(client) {
          Object.keys(client.spec.paths).forEach(function(path) {
            var docs = client.spec.paths[path]
            Object.keys(docs).forEach(function(method) {
              var method_docs = docs[method]
              var func = client.apis.default[method_docs.operationId]
              if (method_docs.description === undefined)
                console.warn(`[ WARN ] ${file}${path}/${method}: does not have a description`)
              if (func == undefined) {
                console.error(`[ ERROR ] ${file}${path}/${method}: could not be turned into a function ${method_docs.operationId === undefined ? '(missing operationId)' : ''}`)
                return
              }
              if (method_docs.operationId !== method_docs.__originalOperationId)
                console.warn(`[ WARN ] ${file}${path}/${method}: operation id had to be changed from ${method_docs.__originalOperationId} to ${method_docs.operationId}`)
              if (method_docs.parameters === undefined) {
                func().then(function(resp) {
                  var captured_response = method_docs.responses[resp.status]
                  if (captured_response === undefined) {
                    console.warn(`[ WARN ] ${file}${path}/${method}/${resp.status}: not a recognized response`)
                  } else {
                    // TODO: validate(resp, captured_response.content)
                    // TODO: validate(resp, captured_response.contentType)
                    console.log(`[ OK ] ${file}${path}/${method}`)
                  }
                }).catch(function(error) {
                  console.error(`[ ERROR ] ${file}${path}/${method}: ${error}`)
                })
              } else {
                var test_params = method_docs.parameters.reduce(function(test_params, param) {
                  if (param.description === undefined) {
                    console.warn(`[ WARN ] ${file}${path}/${method}(${JSON.stringify(param)}): does not have an description`)
                  }
                  if (param.example === undefined) {
                    console.warn(`[ WARN ] ${file}${path}/${method}(${JSON.stringify(param)}): does not have an example`)
                    if (param.required) {
                      console.warn(`[ WARN ] ${file}${path}/${method}: will fail because of missing examples`)
                      return test_params
                    }
                  } else {
                    test_params[param.name] = param.example
                    return test_params
                  }
                }, {})
                func(test_params).then(function(resp) {
                  var captured_response = method_docs.responses[resp.status]
                  if (captured_response === undefined) {
                    console.warn(`[ ERROR ] ${file}${path}/${method}/${resp.status}: not a recognized response`)
                  } else {
                    // TODO: validate(resp, captured_response.content)
                    // TODO: validate(resp, captured_response.contentType)
                    console.log(`[ OK ] ${file}${path}/${method}`)
                  }
                }).catch(function(error) {
                  console.error(`[ ERROR ] ${file}${path}/${method}(${JSON.stringify(test_params)}): ${error}`)
                })
              }
            })
          })
        }).catch(function(error) {
          console.log(`[ ERROR ] ${file}: ${error}`)
        })
      })
    }
  })
})
