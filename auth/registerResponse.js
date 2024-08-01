// const AWS = require('aws-sdk');
const { verifyRegistrationResponse } = require('@simplewebauthn/server');
const { isoBase64URL } = require('@simplewebauthn/server/helpers');
const { l, buildResponse, nullCheck } = require("./utils");
const { createClient } = require('@supabase/supabase-js');
const { rpID } = require('./consts');
const { getUUID } = require('./supa');
var supaBaseUrl = "https://ubimrawvzdznjyqqshaf.supabase.co"
var supaBaseAPIKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViaW1yYXd2emR6bmp5cXFzaGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIzNzI3OTksImV4cCI6MjAzNzk0ODc5OX0.vHSMo4EO_tcauDHvzyrEnB-pOs0O_Nbp1DsGYKVFb2E"
const supabase = createClient(supaBaseUrl, supaBaseAPIKey)

exports.registerResponse = async ({ queryStringParameters, body }) => {
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
    if (data == null) {
      return buildResponse(203, "User deatils incorrect.")
    }
    l.log(data)
    if (error) {
      return buildResponse(203, error)
    }
    l.log(data, "userData")
    // get challege
    const { verified, registrationInfo } = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: data.latest_challenge,
      expectedOrigin: ["http://localhost:5173", "https://login.venkatrohit.com"],
      expectedRPID: rpID,
      requireUserVerification: false
    }); // will throw on error
    if (!verified) {
      return buildResponse(405, 'User auth failed');
    }
    // verified the key
    l.log(registrationInfo, verified)
    var passkeyAdded = await supabase
      .from('credentials')
      .insert({
        user_id: data.id,
        credential_id: registrationInfo.credentialID,
        public_key: isoBase64URL.fromBuffer(registrationInfo.credentialPublicKey),
        attestation_type: "none",
        aaguid: registrationInfo.aaguid,
        signature_count: registrationInfo.counter,
        type: registrationInfo.credentialDeviceType,
        transports: body.response.transports,
        backup_state: registrationInfo.credentialBackedUp
      })
    if (passkeyAdded.error) {
      return buildResponse(201, 'Something Wrong');
    }
    var key = await getUUID(data.id)
    return buildResponse(200, {
      stat: "success",
      key
    });
  } catch (e) {
    console.error(e)
  }
  return buildResponse(500, 'Internal Server Error');
}