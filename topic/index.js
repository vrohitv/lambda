// const AWS = require('aws-sdk');
const { l, buildResponse, nullCheck } = require("./utils");
const { getTopicHeading } = require('./getTopicHeading');
const { getEditorData } = require("./getEditorData");
const { getDrawingData } = require("./getDrawingData");
const { postDrawingData } = require("./postDrawingData");
const { postEditorData } = require("./postEditorData");
const { postTopicHeading } = require("./postTopicHeading");
const {supabase} = require("./supaClient")


l.set(true)
exports.handler = async (event) => {
    var { body, queryStringParameters } = event;
    const path = event.requestContext.http.path
    const http = event.requestContext.http.method
    var bearer = event.headers.authorization
    if (http == "OPTIONS") {
        l.log("Options hit, sending 200")
        return buildResponse(200, 'ok');
    }
    if (nullCheck(bearer)) {
        return buildResponse(400, "Unauthorized!!")
    }
    bearer = bearer.split(" ")[1]
    l.log(bearer, "This is the bearer token")
    if (nullCheck(bearer)) {
        return buildResponse(400, "Unauthorized!!")
    }
    var { data, error } = await supabase
        .from('keys')
        .select("user_id")
        .eq("key", bearer)
        .maybeSingle()
    if (data == null) {
        return buildResponse(203, "User Not Found.")
    }
    l.log(data)
    if (error) {
        return buildResponse(203, "Error in User data get")
    }
    queryStringParameters = {...queryStringParameters}
    queryStringParameters.user_id = data.user_id
    if (http === 'GET') {
        if (path == "/topic/heading") {
            return await getTopicHeading({ queryStringParameters });
        } else if (path == "/topic/drawing") {
            return await getDrawingData({ queryStringParameters })
        } else if (path == "/topic/editor") {
            return await getEditorData({ queryStringParameters })
        } else{
            return buildResponse(404,"Route not found")
        }
        // Post requests
    } else if (http == "POST") {
        // parse JSON body
        body = JSON.parse(body)
        if (path == "/topic/heading") {
            return await postTopicHeading({ queryStringParameters, body })
        } else if (path == "/topic/drawing") {
            return await postDrawingData({ queryStringParameters, body })
        } else if (path == "/topic/editor") {
            return await postEditorData({ queryStringParameters, body })
        } else{
            return buildResponse(404,"Route not found")
        }
    } else{
        return buildResponse(404,"Route not found")
    }
};

