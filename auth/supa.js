const { createClient } = require('@supabase/supabase-js');
var supaBaseUrl = "https://ubimrawvzdznjyqqshaf.supabase.co"
var supaBaseAPIKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViaW1yYXd2emR6bmp5cXFzaGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIzNzI3OTksImV4cCI6MjAzNzk0ODc5OX0.vHSMo4EO_tcauDHvzyrEnB-pOs0O_Nbp1DsGYKVFb2E"
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
