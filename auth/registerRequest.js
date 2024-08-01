// const AWS = require('aws-sdk');
const { generateRegistrationOptions } = require('@simplewebauthn/server');
const { l,buildResponse,nullCheck } = require("./utils");
const { createClient } = require('@supabase/supabase-js');
const {rpID} = require("./consts")
var supaBaseUrl = "https://ubimrawvzdznjyqqshaf.supabase.co"
var supaBaseAPIKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViaW1yYXd2emR6bmp5cXFzaGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIzNzI3OTksImV4cCI6MjAzNzk0ODc5OX0.vHSMo4EO_tcauDHvzyrEnB-pOs0O_Nbp1DsGYKVFb2E"
const supabase = createClient(supaBaseUrl, supaBaseAPIKey)

exports.registerRequest = async({ queryStringParameters}) => {
    // check if email has a passkey
    if (nullCheck(queryStringParameters.email)) {
        return buildResponse(205, "Email not provided")
    }
    const email = queryStringParameters.email
    try {
        var { data, error } = await supabase
            .from('users')
            .select()
            .eq("email", email)
            .maybeSingle()
        l.log(data)
        if (data == null) {
            return buildResponse(203, "User deatils incorrect.")
        }
        l.log(data)
        if (error) {
            return buildResponse(203, error)
        }
        var existingPasskeys = await supabase.from("credentials")
            .select("credential_id,transports").
            eq("user_id", data.id)

        if (existingPasskeys.error) {
            return buildResponse(500, "internal server error")
        }
        // Generate Challege for authentication
        const registrationOptions = await generateRegistrationOptions({
            rpName: "Topics",
            rpID,
            userName: data.email,
            // userId : not needed
            userDisplayName: data.display_name,
            attestationType: 'none',
            excludeCredentials: existingPasskeys.data.map(passkey => ({
                id: passkey.credential_id,
                transports: passkey.transports
            })),
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred',
                authenticatorAttachment: 'platform',
            },
        });
        //Save the challege in the dB
        l.log(registrationOptions)
        l.log("Updated options data", registrationOptions)
        var { error } = await supabase
            .from('users')
            .update({ latest_challenge: registrationOptions.challenge })
            .eq("id", data.id)
            .maybeSingle()
        if (error) {
            return buildResponse(203, error)
        }
        return buildResponse(200, registrationOptions);
    } catch (e) {
        console.log(e)
        return buildResponse(203, e)
    }
}