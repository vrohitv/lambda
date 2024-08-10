// const AWS = require('aws-sdk');
const { l,buildResponse,nullCheck } = require("./utils");
const {supabase} = require("./supaClient")


exports.postTopicHeading = async({queryStringParameters,body})=>{
    try {
        var { error } = await supabase
            .from("topic_trees")
            .upsert({
                user_id: queryStringParameters.user_id,
                topicTree:body
            },{ onConflict: 'user_id' })
            .eq("user_id",queryStringParameters.user_id)
        if (error) {
            console.log(error)
            return buildResponse(500, "Internal error")
        }
        return buildResponse(200,"Success")
    } catch (e) {
        return buildResponse(205, "Data Not found")
    }
}