// const AWS = require('aws-sdk');
const { verifyAuthenticationResponse } = require('@simplewebauthn/server');
const { isoBase64URL } = require('@simplewebauthn/server/helpers');
const { l, buildResponse, nullCheck } = require("./utils");
const { createClient } = require('@supabase/supabase-js');
const { rpID } = require("./consts");
const {getUUID} = require("./supa")
var supaBaseUrl = ""
var supaBaseAPIKey = ""
const supabase = createClient(supaBaseUrl, supaBaseAPIKey)

exports.signinResponse = async ({ queryStringParameters, body }) => {
  if (nullCheck(queryStringParameters.email)) {
    return buildResponse(205, "email not provided")
  }
  const email = queryStringParameters.email
  l.log("The email is:", email)
  try {
    var { data, error } = await supabase
      .from('users')
      .select("id,latest_challenge")
      .eq("email", email)
      .maybeSingle()

    if (data == null) {
      return buildResponse(203, "User deatils incorrect.")
    }
    if (error) {
      return buildResponse(203, error)
    }
    var credData = await supabase
      .from("credentials")
      .select()
      .eq("credential_id", body.id)
      .eq("user_id", data.id)
      .maybeSingle()
    if (credData.error) {
      return buildResponse(203, error)
    }
    let verification
    verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge: data.latest_challenge,
      expectedOrigin: ["http://localhost:5173", "https://login.venkatrohit.com"],
      expectedRPID: rpID,
      authenticator: {
        credentialID: isoBase64URL.toBuffer(body.id),
        credentialPublicKey: isoBase64URL.toBuffer(credData.data.public_key),
        counter: credData.data.signature_count,
        transports: credData.data.transports,
      },
    });
    console.log(verification)
    if (!verification.verified) {
      return buildResponse(405, 'User auth failed');
    }
    var key = await getUUID(data.id)
    return buildResponse(200, {
      stat: "success",
      key
    });
  } catch (e) {
    console.log(e)
    return buildResponse(203, e)
  }
}
return buildResponse(405, 'Something Went wrong2');














