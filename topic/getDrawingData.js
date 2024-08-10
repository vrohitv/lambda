// const AWS = require('aws-sdk');
const { l,buildResponse,nullCheck } = require("./utils");
const { createClient } = require('@supabase/supabase-js');
const {supabase} = require("./supaClient")

exports.getDrawingData = async({queryStringParameters})=>{
    try {
        var { data, error } = await supabase
            .from("notebook_data")
            .select()
            .eq("user_id", queryStringParameters.user_id)
            .eq("drawing_data",queryStringParameters.id )
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