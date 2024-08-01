// const AWS = require('aws-sdk');
const { l,buildResponse } = require("./utils");
const { registerRequest } = require('./registerRequest');
const { registerResponse } =  require('./registerResponse');
const {signinRequest} = require("./signinRequest")
const {signinResponse} = require("./signinResponse")
l.set(true)
exports.handler = async (event) => {
  var { body, queryStringParameters } = event;
  const path = event.requestContext.http.path
  const http = event.requestContext.http.method

  l.log(event)
  if (http === 'GET') {
    if (path == "/auth/registerRequest") {
      return await registerRequest({ queryStringParameters });
    } else if (path == "/auth/signinRequest") {
      return await signinRequest({ queryStringParameters,body })
      /// POST request 
    } 
  }else if (http == "POST") {
      // parse JSON body
      body = JSON.parse(body)
      if (path == "/auth/registerResponse") {
        return await registerResponse({queryStringParameters,body})
      } else if (path == "/auth/signinResponse") {
        return await signinResponse({queryStringParameters,body})
      }
  }else if (http == "OPTIONS") {
      return buildResponse(200, 'Preflight Check');
  }else{
      return buildResponse(405, 'Something Went wrong3');
    }
  };

