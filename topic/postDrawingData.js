// const AWS = require('aws-sdk');
const { l,buildResponse,nullCheck } = require("./utils");
const {supabase} = require("./supaClient")

exports.postDrawingData = async({queryStringParameters,body})=>{
    try {
        var { data,error } = await supabase
            .from("notebook_data")
            .upsert({
                user_id: queryStringParameters.user_id,
                drawing_id:body.id,
                drawing_data:body.data
            },{ onConflict: 'drawing_id' })
            .eq("drawing_id",body.id)
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