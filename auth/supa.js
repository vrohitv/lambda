const { createClient } = require('@supabase/supabase-js');
var supaBaseUrl = ""
var supaBaseAPIKey = ""
const supabase = createClient(supaBaseUrl, supaBaseAPIKey)
const { v4: uuidv4 } = require('uuid');

var getUUID = async(userID)=>{
    var { data, error } = await supabase
        .from('keys')
        .select("key")
        .eq("user_id", userID).maybeSingle()
    if(error) {
        throw new Error(error)
    }
    if(data) {
        return data.key
    }
    var uuid = uuidv4()
    console.log("sfdfs")

    var { error } = await supabase
        .from('keys')
        .insert({
            user_id: userID,
            key: uuid,
        })
    if (error) {
        throw new Error(error)
    }
    return uuid
}
exports.getUUID = getUUID;
