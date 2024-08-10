// const AWS = require('aws-sdk');
const { l,buildResponse,nullCheck } = require("./utils");
const {supabase} = require("./supaClient")


exports.postEditorData = async({queryStringParameters,body})=>{
    try {
        var { data,error } = await supabase
            .from("topic_editor_data")
            .upsert({
                user_id: queryStringParameters.user_id,
                topic_heading_id:body.id,
                editor_data:body.data
            },{ onConflict: 'topic_heading_id' })
            .eq("topic_heading_id",body.id)
            .select()
        console.log(data)
        if (error) {
            console.log(error)
            return buildResponse(500, "Internal error")
        }
        return buildResponse(200,"Success")
    } catch (e) {
        console.log(e)
        return buildResponse(205, "Data Not found")
    }
}