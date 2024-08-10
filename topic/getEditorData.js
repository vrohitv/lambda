// const AWS = require('aws-sdk');
const { l,buildResponse,nullCheck } = require("./utils");
const {supabase} = require("./supaClient")


exports.getEditorData = async({queryStringParameters,body})=>{
    try {
        var { data, error } = await supabase
            .from("topic_editor_data")
            .select()
            .eq("user_id", queryStringParameters.user_id)
            .eq("topic_heading_id",queryStringParameters.id )
            .maybeSingle()
        if (data == null) {
            return buildResponse(203, "Topics not found.")
        }
        if (error) {
            console.log(error)
            return buildResponse(500, "Internal error")
        }
        return buildResponse(200,data)
    } catch (e) {
        return buildResponse(205, "Data Not found")
    }
}