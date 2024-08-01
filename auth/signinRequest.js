// const AWS = require('aws-sdk');
const { generateAuthenticationOptions } = require('@simplewebauthn/server');
const { l, buildResponse, nullCheck } = require("./utils");
const { createClient } = require('@supabase/supabase-js');
const {rpID} = require("./consts")
var supaBaseUrl = "https://ubimrawvzdznjyqqshaf.supabase.co"
var supaBaseAPIKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViaW1yYXd2emR6bmp5cXFzaGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIzNzI3OTksImV4cCI6MjAzNzk0ODc5OX0.vHSMo4EO_tcauDHvzyrEnB-pOs0O_Nbp1DsGYKVFb2E"
const supabase = createClient(supaBaseUrl, supaBaseAPIKey)

exports.signinRequest = async ({ queryStringParameters }) => {
    if (nullCheck(queryStringParameters.email)) {
        return buildResponse(205, "email not provided")
    }
    const email = queryStringParameters.email
    l.log("The Email is:", email)
    try {
        
        //Save challege to be implemented
        // req.session.challenge = options.challenge;
        var isUserAvailable = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .maybeSingle()
        if(!isUserAvailable.data){
            return buildResponse(203, "User does not exist")
        }
        if (isUserAvailable.error) {
                return buildResponse(203, error)
        }
        var existingPasskeys = await supabase.from("credentials")
            .select("credential_id,transports").
            eq("user_id", isUserAvailable.data.id)

        if (existingPasskeys.error) {
            return buildResponse(500, "internal server error")
        }
        console.log(process.env.HOSTNAME)
        const options = await generateAuthenticationOptions({
            rpID: rpID,
            allowCredentials: existingPasskeys.data.map(passkey => ({
                id: passkey.credential_id,
                transports: passkey.transports
            })),
        });
        l.log(options)
        var det = await supabase
            .from('users')
            .update({ latest_challenge: options.challenge })
            .eq("email", email)
            .maybeSingle()
        if (det.error) {
            return buildResponse(203, error)
        }
        return buildResponse(200, options);
    } catch (e) {
        console.error(e);
        return buildResponse(405, 'Something Went wrong5');
    }
}